import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Icon,
  ActionButton,
  useTheme,
  appendClassNames,
  useComponentOverrides,
} from '@embeddedchat/ui-elements';
import {
  usePinnedMessageStore,
  useChannelStore,
  useSidebarStore,
} from '../../store';
import { useRCContext } from '../../context/RCInstance';
import getPinnedMessageBannerStyles from './PinnedMessageBanner.styles';

const getMessageSnippet = (message) => {
  if (!message) return '';
  let text = message.msg || '';
  if (!text && message.attachments && message.attachments.length > 0) {
    const att = message.attachments[0];
    text =
      att.description ||
      att.title ||
      att.fallback ||
      (att.image_url
        ? 'Attachment: Image'
        : att.video_url
        ? 'Attachment: Video'
        : att.audio_url
        ? 'Attachment: Audio'
        : 'Attachment');
  }
  if (!text && message.file) {
    text = message.file.name || 'File';
  }
  // Strip markdown formatting for a clean inline preview snippet
  text = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length > 80) {
    return `${text.slice(0, 80)}...`;
  }
  return text || 'Pinned message';
};

const PinnedMessageBanner = ({ className = '', style = {} }) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'PinnedMessageBanner'
  );
  const { theme, mode } = useTheme();
  const styles = useMemo(
    () => getPinnedMessageBannerStyles(theme, mode),
    [theme, mode]
  );

  const { RCInstance, ECOptions } = useRCContext();
  const showPinnedBannerOption = ECOptions?.showPinnedBanner ?? true;

  const channelInfo = useChannelStore((state) => state.channelInfo);
  const roomId =
    RCInstance?.rid || channelInfo?._id || ECOptions?.roomId || 'default';

  const pinnedMessages = usePinnedMessageStore((state) => state.pinnedMessages);
  const dismissedRooms = usePinnedMessageStore((state) => state.dismissedRooms);
  const dismissBannerForRoom = usePinnedMessageStore(
    (state) => state.dismissBannerForRoom
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when room changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [roomId]);

  // Adjust index if out of bounds after pinned messages change
  useEffect(() => {
    if (pinnedMessages && currentIndex >= pinnedMessages.length) {
      setCurrentIndex(Math.max(0, pinnedMessages.length - 1));
    }
  }, [currentIndex, pinnedMessages]);

  const total = pinnedMessages ? pinnedMessages.length : 0;
  const isDismissed = Boolean(roomId && dismissedRooms[roomId]);

  const currentMessage = useMemo(() => {
    if (!pinnedMessages || pinnedMessages.length === 0) return null;
    return pinnedMessages[currentIndex] || pinnedMessages[0];
  }, [pinnedMessages, currentIndex]);

  const handlePrev = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
    },
    [total]
  );

  const handleNext = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev + 1 < total ? prev + 1 : 0));
    },
    [total]
  );

  const handleDismiss = useCallback(
    (e) => {
      e.stopPropagation();
      dismissBannerForRoom(roomId);
    },
    [dismissBannerForRoom, roomId]
  );

  const setShowPinned = usePinnedMessageStore((state) => state.setShowPinned);
  const setShowSidebar = useSidebarStore((state) => state.setShowSidebar);

  const handleBannerClick = useCallback(() => {
    if (!currentMessage?._id) return;
    const msgId = currentMessage._id;
    const targetEl =
      document.getElementById(`ec-message-${msgId}`) ||
      document
        .getElementById(`ec-message-body-${msgId}`)
        ?.closest('.ec-message') ||
      document.getElementById(`ec-message-body-${msgId}`);

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetEl.classList.remove('ec-message-highlighted');
      // Trigger reflow to restart animation if already highlighted
      if (typeof targetEl.offsetWidth === 'number') {
        targetEl.classList.add('ec-message-highlighted');
      }
      setTimeout(() => {
        targetEl.classList.remove('ec-message-highlighted');
      }, 2500);
    } else {
      // If message is not rendered in current viewport, open pinned messages sidebar
      setShowPinned(true);
      setShowSidebar(true);
    }
  }, [currentMessage, setShowPinned, setShowSidebar]);

  if (
    !showPinnedBannerOption ||
    isDismissed ||
    total === 0 ||
    !currentMessage
  ) {
    return null;
  }

  const authorName =
    currentMessage.u?.username || currentMessage.u?.name || 'User';
  const snippet = getMessageSnippet(currentMessage);

  return (
    <Box
      css={styles.bannerContainer}
      className={appendClassNames(
        'ec-pinned-message-banner',
        className,
        classNames
      )}
      style={{ ...styleOverrides, ...style }}
    >
      <Box
        css={styles.contentWrapper}
        onClick={handleBannerClick}
        title="Click to view message in chat"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBannerClick();
          }
        }}
      >
        <span css={styles.pinIcon}>
          <Icon name="pin" size="1.1rem" />
        </span>
        <Box css={styles.textContainer}>
          <span css={styles.author}>{authorName}:</span>
          <span css={styles.snippet}>{snippet}</span>
        </Box>
      </Box>

      <Box css={styles.actionsContainer}>
        {total > 1 && (
          <>
            <ActionButton
              ghost
              square
              size="small"
              onClick={handlePrev}
              title="Previous pinned message"
              aria-label="Previous pinned message"
            >
              <Icon
                name="chevron-left"
                size="1rem"
                style={{ transform: 'rotate(180deg)' }}
              />
            </ActionButton>
            <span css={styles.counter}>
              {currentIndex + 1} / {total}
            </span>
            <ActionButton
              ghost
              square
              size="small"
              onClick={handleNext}
              title="Next pinned message"
              aria-label="Next pinned message"
            >
              <Icon name="chevron-left" size="1rem" />
            </ActionButton>
          </>
        )}
        <ActionButton
          ghost
          square
          size="small"
          onClick={handleDismiss}
          title="Dismiss pinned banner"
          aria-label="Dismiss pinned banner"
        >
          <Icon name="cross" size="0.875rem" />
        </ActionButton>
      </Box>
    </Box>
  );
};

PinnedMessageBanner.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default PinnedMessageBanner;
