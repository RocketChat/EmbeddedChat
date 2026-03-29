import React from 'react';
import { css } from '@emotion/react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { useFederation } from '../../context/FederationContext';

const getStyles = (theme) => ({
  banner: css`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 1rem;
    background: #0dbd8b18;
    border-bottom: 1px solid #0dbd8b44;
    font-size: 0.72rem;
    font-weight: 600;
    color: #0dbd8b;
    letter-spacing: 0.03em;
  `,
  dot: css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0dbd8b;
    flex-shrink: 0;
  `,
  homeserver: css`
    font-weight: 400;
    opacity: 0.75;
    margin-left: 2px;
  `,
});

/**
 * FederationBanner
 *
 * Renders a slim banner below the chat header when the active room is
 * Matrix-bridged. Hidden when the room is not federated or detection is
 * still in flight.
 *
 * Activated automatically by FederationProvider — no props needed.
 */
const FederationBanner = () => {
  const { isFederated, matrixHomeserver, federationLoading } = useFederation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (federationLoading || !isFederated) return null;

  return (
    <Box css={styles.banner} aria-live="polite" role="status">
      <Box css={styles.dot} />
      🔗 Matrix federated room
      {matrixHomeserver && (
        <Box is="span" css={styles.homeserver}>
          · {matrixHomeserver}
        </Box>
      )}
    </Box>
  );
};

export default FederationBanner;
