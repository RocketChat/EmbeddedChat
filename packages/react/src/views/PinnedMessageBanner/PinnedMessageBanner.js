import React, { useState, useEffect, useCallback } from 'react';
import { Box, Icon, useTheme } from '@embeddedchat/ui-elements';
import usePinnedMessageStore from '../../store/pinnedMessageStore';
import { useRCContext } from '../../context/RCInstance';
import getPinnedMessageBannerStyles from './PinnedMessageBanner.styles';

const SESSION_KEY = 'ec-pinned-banner-dismissed';

const getDismissedRooms = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]');
  } catch {
    return [];
  }
};

const PinnedMessageBanner = () => {
  const { ECOptions, RCInstance } = useRCContext();
  const { theme } = useTheme();
  const styles = getPinnedMessageBannerStyles({ theme });

  const pinnedMessages = usePinnedMessageStore((state) => state.pinnedMessages);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const roomId = RCInstance?.rid;

  useEffect(() => {
    setCurrentIndex(0);
    const dismissedRooms = getDismissedRooms();
    setDismissed(dismissedRooms.includes(roomId));
  }, [roomId]);

  useEffect(() => {
    if (currentIndex >= pinnedMessages.length && pinnedMessages.length > 0) {
      setCurrentIndex(pinnedMessages.length - 1);
    }
  }, [pinnedMessages.length, currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : pinnedMessages.length - 1));
  }, [pinnedMessages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i < pinnedMessages.length - 1 ? i + 1 : 0));
  }, [pinnedMessages.length]);

  const handleClick = useCallback(() => {
    const msg = pinnedMessages[currentIndex];
    if (!msg) return;
    const el = document.getElementById(`ec-message-body-${msg._id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.transition = 'background-color 0.3s ease';
      el.style.backgroundColor = `${theme.colors.primary}33`;
      setTimeout(() => {
        el.style.backgroundColor = '';
      }, 1500);
    }
  }, [pinnedMessages, currentIndex, theme.colors.primary]);

  const handleDismiss = useCallback(() => {
    const dismissedRooms = getDismissedRooms();
    if (!dismissedRooms.includes(roomId)) {
      dismissedRooms.push(roomId);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(dismissedRooms));
    }
    setDismissed(true);
  }, [roomId]);

  if (ECOptions?.showPinnedBanner === false) return null;
  if (dismissed) return null;
  if (!pinnedMessages || pinnedMessages.length === 0) return null;

  const msg = pinnedMessages[currentIndex];
  const snippet =
    msg?.msg?.length > 80 ? `${msg.msg.slice(0, 80)}...` : msg?.msg || '';
  const author = msg?.u?.username || '';
  const total = pinnedMessages.length;

  return (
    <Box css={styles.banner}>
      <Icon name="pin" size="1rem" css={styles.pinIcon} />
      <Box
        css={styles.content}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        <Box css={styles.label}>Pinned message</Box>
        <Box css={styles.text}>
          {author ? `${author}: ` : ''}
          {snippet}
        </Box>
      </Box>
      <Box css={styles.controls}>
        {total > 1 && (
          <>
            <button
              type="button"
              css={styles.navButton}
              onClick={handlePrev}
              aria-label="Previous pinned message"
            >
              <Icon name="chevron-up" size="0.85rem" />
            </button>
            <span css={styles.counter}>
              {currentIndex + 1} / {total}
            </span>
            <button
              type="button"
              css={styles.navButton}
              onClick={handleNext}
              aria-label="Next pinned message"
            >
              <Icon name="chevron-down" size="0.85rem" />
            </button>
          </>
        )}
        <button
          type="button"
          css={styles.closeButton}
          onClick={handleDismiss}
          aria-label="Dismiss pinned message banner"
        >
          <Icon name="cross" size="0.85rem" />
        </button>
      </Box>
    </Box>
  );
};

export default PinnedMessageBanner;
