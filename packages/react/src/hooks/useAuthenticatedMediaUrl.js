import { useState, useEffect, useContext, useRef } from 'react';
import RCContext from '../context/RCInstance';

// In-memory cache for protected media blobs to avoid redundant network fetches
const mediaBlobCache = new Map();
const MAX_CACHE_SIZE = 100;

const cacheBlob = (url, blob) => {
  if (mediaBlobCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = mediaBlobCache.keys().next().value;
    mediaBlobCache.delete(oldestKey);
  }
  mediaBlobCache.set(url, blob);
};

export const clearMediaBlobCache = () => {
  mediaBlobCache.clear();
};

/**
 * Resolves a media path relative to the host if needed.
 */
export const resolveMediaUrl = (mediaPath, host) => {
  if (!mediaPath || typeof mediaPath !== 'string') {
    return '';
  }

  const isHttpUrl = /^https?:\/\//i.test(mediaPath);
  if (!isHttpUrl && !host) {
    return mediaPath;
  }

  try {
    const targetUrl = isHttpUrl ? new URL(mediaPath) : new URL(mediaPath, host);
    return targetUrl.toString();
  } catch (e) {
    return isHttpUrl ? mediaPath : `${host || ''}${mediaPath}`;
  }
};

/**
 * Checks whether a media URL targets an internal Rocket.Chat /file-upload/ path.
 */
export const isProtectedFileUpload = (mediaPath, host) => {
  if (!mediaPath || typeof mediaPath !== 'string') {
    return false;
  }

  const isHttpUrl = /^https?:\/\//i.test(mediaPath);
  if (!isHttpUrl && !host) {
    return false;
  }

  try {
    const targetUrl = isHttpUrl ? new URL(mediaPath) : new URL(mediaPath, host);
    const hostUrl = host ? new URL(host) : null;
    const isSameHost = hostUrl
      ? targetUrl.origin === hostUrl.origin
      : !isHttpUrl;

    return isSameHost && targetUrl.pathname.startsWith('/file-upload/');
  } catch (e) {
    return false;
  }
};

const getCredentialsFromUser = (user, RCInstance) => {
  const token =
    user?.authToken || user?.data?.authToken || RCInstance?.token || null;
  const userId =
    user?.userId ||
    user?.data?.userId ||
    user?._id ||
    RCInstance?.userId ||
    null;
  return { token, userId };
};

const useAuthenticatedMediaUrl = (mediaPath, host) => {
  const { RCInstance } = useContext(RCContext);
  const effectiveHost = host || RCInstance?.getHost?.() || '';

  const [mediaUrl, setMediaUrl] = useState(() =>
    resolveMediaUrl(mediaPath, effectiveHost)
  );

  const activeBlobUrlRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (!mediaPath || typeof mediaPath !== 'string') {
      setMediaUrl('');
      return undefined;
    }

    const cleanUrl = resolveMediaUrl(mediaPath, effectiveHost);
    const isProtected = isProtectedFileUpload(mediaPath, effectiveHost);

    // External media or non-protected uploads are delivered directly with zero overhead
    if (!isProtected) {
      setMediaUrl(cleanUrl);
      return undefined;
    }

    const loadProtectedMedia = async (user) => {
      const { token, userId } = getCredentialsFromUser(user, RCInstance);

      if (!token || !userId) {
        if (isMounted) setMediaUrl(cleanUrl);
        return;
      }

      // Check in-memory blob cache first
      if (mediaBlobCache.has(cleanUrl)) {
        const cachedBlob = mediaBlobCache.get(cleanUrl);
        const objectUrl = URL.createObjectURL(cachedBlob);
        if (isMounted) {
          if (activeBlobUrlRef.current) {
            URL.revokeObjectURL(activeBlobUrlRef.current);
          }
          activeBlobUrlRef.current = objectUrl;
          setMediaUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
        return;
      }

      try {
        let response;
        try {
          response = await fetch(cleanUrl, {
            method: 'GET',
            headers: {
              'X-Auth-Token': token,
              'X-User-Id': userId,
            },
            signal: controller.signal,
          });
        } catch (fetchErr) {
          // If cross-origin request failed (e.g. CORS preflight blocked on static upload path),
          // fallback to same-origin relative path if available in reverse proxy / dev setups
          if (
            typeof window !== 'undefined' &&
            isProtected &&
            cleanUrl.includes('/file-upload/')
          ) {
            try {
              const parsed = new URL(cleanUrl);
              if (parsed.origin !== window.location.origin) {
                const proxyUrl = `${parsed.pathname}${parsed.search}`;
                response = await fetch(proxyUrl, {
                  method: 'GET',
                  headers: {
                    'X-Auth-Token': token,
                    'X-User-Id': userId,
                  },
                  signal: controller.signal,
                });
              } else {
                throw fetchErr;
              }
            } catch (_) {
              throw fetchErr;
            }
          } else {
            throw fetchErr;
          }
        }

        if (!response.ok) {
          throw new Error(`Media fetch failed with status ${response.status}`);
        }

        const blob = await response.blob();
        cacheBlob(cleanUrl, blob);

        const objectUrl = URL.createObjectURL(blob);
        if (isMounted) {
          if (activeBlobUrlRef.current) {
            URL.revokeObjectURL(activeBlobUrlRef.current);
          }
          activeBlobUrlRef.current = objectUrl;
          setMediaUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Gracefully fallback to cleanUrl on fetch error
          if (isMounted) setMediaUrl(cleanUrl);
        }
      }
    };

    const currentUser = RCInstance?.auth?.currentUser;
    if (currentUser) {
      loadProtectedMedia(currentUser);
    } else if (RCInstance?.auth?.getCurrentUser) {
      RCInstance.auth
        .getCurrentUser()
        .then((user) => {
          if (isMounted) loadProtectedMedia(user);
        })
        .catch(() => {
          if (isMounted) setMediaUrl(cleanUrl);
        });
    } else {
      loadProtectedMedia(null);
    }

    const handleAuthChange = (user) => {
      if (!isMounted) return;
      if (!user) {
        clearMediaBlobCache();
      }
      loadProtectedMedia(user);
    };

    if (RCInstance?.auth?.onAuthChange) {
      RCInstance.auth.onAuthChange(handleAuthChange);
    }

    return () => {
      isMounted = false;
      controller.abort();
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
        activeBlobUrlRef.current = null;
      }
      if (RCInstance?.auth?.removeAuthListener) {
        RCInstance.auth.removeAuthListener(handleAuthChange);
      }
    };
  }, [RCInstance, mediaPath, effectiveHost]);

  return mediaUrl;
};

export default useAuthenticatedMediaUrl;
