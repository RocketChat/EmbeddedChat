export { default as EmbeddedChat } from './views/EmbeddedChat';
export { FederationProvider, useFederation } from './context/FederationContext';
export { isMatrixUser, parseMatrixUserId, getMatrixDisplayLabel, getMatrixInitials, getAvatarColor } from './lib/federationUtils';
export { default as MatrixAvatar } from './views/Message/MatrixAvatar';
export { default as FederationBanner } from './views/FederationBanner/FederationBanner';
