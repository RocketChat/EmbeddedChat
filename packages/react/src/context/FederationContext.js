import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Exposes federation state to the component tree.
 * @property {boolean} isFederated - true when the active room is Matrix-bridged
 * @property {string|null} matrixHomeserver - the homeserver origin (e.g. "matrix.org")
 * @property {boolean} federationLoading - true while room info is being fetched
 */
const FederationContext = createContext({
  isFederated: false,
  matrixHomeserver: null,
  federationLoading: false,
});

export const FederationProvider = ({ children, RCInstance, forceEnabled = false }) => {
  const [isFederated, setIsFederated] = useState(forceEnabled);
  const [matrixHomeserver, setMatrixHomeserver] = useState(
    forceEnabled ? 'matrix.org' : null
  );
  const [federationLoading, setFederationLoading] = useState(!forceEnabled);

  useEffect(() => {
    // When force-enabled (demo/story mode), skip server detection
    if (forceEnabled) return;

    if (!RCInstance) {
      setFederationLoading(false);
      return;
    }

    let cancelled = false;

    const detectFederation = async () => {
      try {
        setFederationLoading(true);
        const info = await RCInstance.channelInfo();
        if (cancelled) return;

        const room = info?.room;
        const federated =
          room?.federated === true || room?.federation != null;

        setIsFederated(federated);

        if (federated && room?.federation?.origin) {
          setMatrixHomeserver(room.federation.origin);
        }
      } catch {
        if (!cancelled) setIsFederated(false);
      } finally {
        if (!cancelled) setFederationLoading(false);
      }
    };

    detectFederation();
    return () => {
      cancelled = true;
    };
  }, [RCInstance, forceEnabled]);

  return (
    <FederationContext.Provider
      value={{ isFederated, matrixHomeserver, federationLoading }}
    >
      {children}
    </FederationContext.Provider>
  );
};

export const useFederation = () => useContext(FederationContext);

export default FederationContext;
