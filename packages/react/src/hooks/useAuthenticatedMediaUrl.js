import { useState, useEffect, useContext } from 'react';
import RCContext from '../context/RCInstance';

/**
 * Builds an authenticated URL for Rocket.Chat media uploads.
 * Only appends credentials if the target is an internal /file-upload/ path.
 * External URLs are strictly returned untouched to prevent credential leakage.
 */
export const buildAuthenticatedUrl = (mediaPath, host, token, userId) => {
  if (!mediaPath || typeof mediaPath !== 'string') {
    return '';
  }

  const isHttpUrl = /^https?:\/\//i.test(mediaPath);

  if (!isHttpUrl && !host) {
    return mediaPath;
  }

  try {
    const targetUrl = isHttpUrl ? new URL(mediaPath) : new URL(mediaPath, host);
    const hostUrl = host ? new URL(host) : null;

    const isSameHost = hostUrl
      ? targetUrl.origin === hostUrl.origin
      : !isHttpUrl;
    const isFileUpload = targetUrl.pathname.startsWith('/file-upload/');

    if (isFileUpload && isSameHost && token && userId) {
      targetUrl.searchParams.set('rc_token', token);
      targetUrl.searchParams.set('rc_uid', userId);
      return targetUrl.toString();
    }

    return isHttpUrl ? mediaPath : targetUrl.toString();
  } catch (e) {
    return isHttpUrl ? mediaPath : `${host || ''}${mediaPath}`;
  }
};

const getCredentialsFromUser = (user) => {
  if (!user) return { token: null, userId: null };
  const token = user.authToken || user.data?.authToken || null;
  const userId = user.userId || user.data?.userId || user._id || null;
  return { token, userId };
};

const useAuthenticatedMediaUrl = (mediaPath, host) => {
  const { RCInstance } = useContext(RCContext);
  const effectiveHost = host || RCInstance?.getHost?.() || '';

  const currentUser = RCInstance?.auth?.currentUser;
  const initialCreds = getCredentialsFromUser(currentUser);

  const [authenticatedUrl, setAuthenticatedUrl] = useState(() =>
    buildAuthenticatedUrl(
      mediaPath,
      effectiveHost,
      initialCreds.token,
      initialCreds.userId
    )
  );

  useEffect(() => {
    let isMounted = true;

    const updateUrl = (user) => {
      if (!isMounted) return;
      const { token, userId } = getCredentialsFromUser(user);
      const newUrl = buildAuthenticatedUrl(
        mediaPath,
        effectiveHost,
        token,
        userId
      );
      setAuthenticatedUrl(newUrl);
    };

    if (RCInstance?.auth?.getCurrentUser) {
      RCInstance.auth
        .getCurrentUser()
        .then((user) => {
          updateUrl(user);
        })
        .catch(() => {
          // Gracefully maintain existing url state on failure
        });
    }

    const handleAuthChange = (user) => {
      updateUrl(user);
    };

    if (RCInstance?.auth?.onAuthChange) {
      RCInstance.auth.onAuthChange(handleAuthChange);
    }

    return () => {
      isMounted = false;
      if (RCInstance?.auth?.removeAuthListener) {
        RCInstance.auth.removeAuthListener(handleAuthChange);
      }
    };
  }, [RCInstance, mediaPath, effectiveHost]);

  return authenticatedUrl;
};

export default useAuthenticatedMediaUrl;
