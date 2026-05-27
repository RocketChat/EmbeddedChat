import React from 'react';
import { getMatrixInitials, getAvatarColor } from '../../lib/federationUtils';

/**
 * Coloured initials avatar for Matrix-federated users.
 * Used as a fallback when the user has no Rocket.Chat avatar.
 */
const MatrixAvatar = ({ matrixId, size = '2.25em', onClick }) => {
  const initials = getMatrixInitials(matrixId);
  const bg = getAvatarColor(matrixId);

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: bg,
    color: '#fff',
    fontSize: `calc(${size} * 0.4)`,
    fontWeight: 700,
    flexShrink: 0,
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
  };

  return (
    <span
      style={style}
      onClick={onClick}
      aria-label={`Avatar for ${matrixId}`}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {initials}
    </span>
  );
};

export default MatrixAvatar;
