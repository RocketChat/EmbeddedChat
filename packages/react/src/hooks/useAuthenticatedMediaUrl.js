import { useState, useEffect, useContext, useRef } from 'react';
import RCContext from '../context/RCInstance';

// In-memory cache for protected media blobs to avoid redundant network fetches.
// Scoped to each embed's signed-in session (userId) to prevent cross-account cache access.
const mediaBlobCache = new Map();
const MAX_CACHE_SIZE = 100;

const getCacheKey = (userId, url) => `${userId}:${url}`;

const cacheBlob = (userId, url, blob) => {
  if (!userId || !url || !blob) {
    return;
  }
  if (mediaBlobCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = mediaBlobCache.keys().next().value;
    mediaBlobCache.delete(oldestKey);
  }
  mediaBlobCache.set(getCacheKey(userId, url), blob);
};

export const clearMediaBlobCache = (userId) => {
  if (userId) {
    Array.from(mediaBlobCache.keys()).forEach((key) => {
      if (key.startsWith(`${userId}:`)) {
        mediaBlobCache.delete(key);
      }
    });
  } else {
    mediaBlobCache.clear();
  }
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
    let activeController = null;

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
      // Cancel previous in-flight fetch for this hook instance
      if (activeController) {
        activeController.abort();
      }
      activeController = new AbortController();
      const { signal } = activeController;

      const { token, userId } = getCredentialsFromUser(user, RCInstance);

      if (!token || !userId) {
        if (isMounted && !signal.aborted) {
          setMediaUrl(cleanUrl);
        }
        return;
      }

      // Check session-scoped in-memory blob cache first
      const cacheKey = getCacheKey(userId, cleanUrl);
      if (mediaBlobCache.has(cacheKey)) {
        const cachedBlob = mediaBlobCache.get(cacheKey);
        const objectUrl = URL.createObjectURL(cachedBlob);
        if (isMounted && !signal.aborted) {
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

      let targetUrl;
      let hostUrl;
      try {
        targetUrl = new URL(cleanUrl);
        hostUrl = effectiveHost ? new URL(effectiveHost) : null;
      } catch (_) {
        if (isMounted && !signal.aborted) {
          setMediaUrl(cleanUrl);
        }
        return;
      }

      // Strictly ensure target origin matches the configured Rocket.Chat host
      if (!hostUrl || targetUrl.origin !== hostUrl.origin) {
        if (isMounted && !signal.aborted) {
          setMediaUrl(cleanUrl);
        }
        return;
      }

      try {
        const response = await fetch(cleanUrl, {
          method: 'GET',
          headers: {
            'X-Auth-Token': token,
            'X-User-Id': userId,
          },
          redirect: 'error',
          signal,
        });

        if (!response.ok) {
          throw new Error(`Media fetch failed with status ${response.status}`);
        }

        const blob = await response.blob();

        // Prevent late response from populating cache or setting state after session change or unmount
        if (signal.aborted || !isMounted) {
          return;
        }

        cacheBlob(userId, cleanUrl, blob);

        const objectUrl = URL.createObjectURL(blob);
        if (isMounted && !signal.aborted) {
          if (activeBlobUrlRef.current) {
            URL.revokeObjectURL(activeBlobUrlRef.current);
          }
          activeBlobUrlRef.current = objectUrl;
          setMediaUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted && !signal.aborted) {
          // Gracefully fallback to cleanUrl on fetch error
          setMediaUrl(cleanUrl);
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
          if (isMounted) {
            loadProtectedMedia(user);
          }
        })
        .catch(() => {
          if (isMounted) {
            setMediaUrl(cleanUrl);
          }
        });
    } else {
      loadProtectedMedia(null);
    }

    const handleAuthChange = (user) => {
      if (!isMounted) {
        return;
      }
      // Cancel pending fetches immediately when session changes
      if (activeController) {
        activeController.abort();
        activeController = null;
      }
      if (!user) {
        clearMediaBlobCache();
        if (activeBlobUrlRef.current) {
          URL.revokeObjectURL(activeBlobUrlRef.current);
          activeBlobUrlRef.current = null;
        }
        setMediaUrl(cleanUrl);
        return;
      }
      loadProtectedMedia(user);
    };

    if (RCInstance?.auth?.onAuthChange) {
      RCInstance.auth.onAuthChange(handleAuthChange);
    }

    return () => {
      isMounted = false;
      if (activeController) {
        activeController.abort();
        activeController = null;
      }
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
