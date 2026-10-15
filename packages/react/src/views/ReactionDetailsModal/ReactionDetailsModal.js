import React, { useState, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Avatar,
  Button,
  Icon,
  useTheme,
  useComponentOverrides,
  appendClassNames,
} from '@embeddedchat/ui-elements';
import { Markdown } from '../Markdown';
import {
  serializeReactions,
  getReactorsList,
  getTotalReactionCount,
} from '../../lib/reaction';
import { getReactionDetailsModalStyles } from './ReactionDetailsModal.styles';
import RCContext, { useRCContext } from '../../context/RCInstance';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';
import { useUserStore } from '../../store';

const ReactionDetailsModal = ({
  message,
  initialEmoji = null,
  authenticatedUserUsername = '',
  handleEmojiClick = () => {},
  onClose = () => {},
  className = '',
  style = {},
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'ReactionDetailsModal',
    className,
    style
  );
  const { theme } = useTheme();
  const styles = getReactionDetailsModalStyles(theme);
  const { RCInstance } = useContext(RCContext);
  const { ECOptions } = useRCContext();

  const serialized = useMemo(
    () => serializeReactions(message?.reactions),
    [message?.reactions]
  );

  const totalCount = useMemo(
    () => getTotalReactionCount(message?.reactions),
    [message?.reactions]
  );

  const [activeTab, setActiveTab] = useState(() => {
    if (initialEmoji && message?.reactions?.[initialEmoji]) {
      return initialEmoji;
    }
    return serialized[0]?.name || 'all';
  });

  const reactors = useMemo(
    () => getReactorsList(message?.reactions, activeTab),
    [message?.reactions, activeTab]
  );

  const setExclusiveState = useSetExclusiveState();
  const { setShowCurrentUserInfo, setCurrentUser } = useUserStore((state) => ({
    setShowCurrentUserInfo: state.setShowCurrentUserInfo,
    setCurrentUser: state.setCurrentUser,
  }));

  const host = RCInstance?.getHost ? RCInstance.getHost() : ECOptions?.host;

  const getUserAvatarUrl = (username) => {
    if (!host || !username) {
      return null;
    }
    return `${host}/avatar/${username}`;
  };

  const handleUserClick = (user) => {
    if (setCurrentUser && setShowCurrentUserInfo) {
      setExclusiveState(setShowCurrentUserInfo);
      setCurrentUser(user);
      onClose();
    }
  };

  const activeReaction = serialized.find((r) => r.name === activeTab);
  const hasUserReactedToActive = Boolean(
    activeReaction?.usernames?.includes(authenticatedUserUsername)
  );

  const handleToggleActiveReaction = () => {
    if (!activeReaction) {
      return;
    }
    handleEmojiClick(activeReaction, message, !hasUserReactedToActive);
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header>
        <Box css={styles.headerContent}>
          <Icon name="emoji" size="1.25rem" />
          <Modal.Title>Reactions</Modal.Title>
        </Box>
        <Modal.Close onClick={onClose} />
      </Modal.Header>

      <Modal.Content
        className={appendClassNames('ec-reaction-details-modal', classNames)}
        style={{ ...styles.modalDialog, ...styleOverrides }}
      >
        <Box css={styles.tabList} role="tablist" aria-label="Reaction filters">
          <button
            type="button"
            css={styles.tabButton(activeTab === 'all')}
            onClick={() => setActiveTab('all')}
            role="tab"
            aria-selected={activeTab === 'all'}
          >
            All {totalCount}
          </button>
          {serialized.map((reaction) => (
            <button
              key={reaction.name}
              type="button"
              css={styles.tabButton(activeTab === reaction.name)}
              onClick={() => setActiveTab(reaction.name)}
              role="tab"
              aria-selected={activeTab === reaction.name}
            >
              <Markdown body={reaction.name} isReaction />
              <span>{reaction.count}</span>
            </button>
          ))}
        </Box>

        <Box css={styles.reactorsList} role="tabpanel">
          {reactors.length === 0 ? (
            <Box css={styles.emptyState}>No reactions found</Box>
          ) : (
            reactors.map((reactor, index) => {
              const isCurrentUser =
                reactor.username === authenticatedUserUsername;
              return (
                <Box
                  key={`${reactor.emoji}_${reactor.username}_${index}`}
                  css={styles.reactorRow}
                >
                  <Box
                    css={styles.userSection}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      handleUserClick({
                        username: reactor.username,
                        name: reactor.name,
                      })
                    }
                  >
                    <Avatar
                      url={getUserAvatarUrl(reactor.username)}
                      alt={reactor.username}
                      size="2rem"
                    />
                    <Box css={styles.userInfo}>
                      <Box css={styles.nameContainer}>
                        <span css={styles.displayName}>{reactor.name}</span>
                        {isCurrentUser && (
                          <span css={styles.youBadge}>You</span>
                        )}
                      </Box>
                      <span css={styles.username}>@{reactor.username}</span>
                    </Box>
                  </Box>

                  <Box css={styles.actionSection}>
                    <Box css={styles.emojiBadge}>
                      <Markdown body={reactor.emoji} isReaction />
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Modal.Content>

      <Modal.Footer>
        {activeReaction && authenticatedUserUsername && (
          <Button
            type={hasUserReactedToActive ? 'secondary' : 'primary'}
            size="small"
            onClick={handleToggleActiveReaction}
          >
            {hasUserReactedToActive ? 'Remove reaction' : 'React'}
          </Button>
        )}
        <Button type="secondary" size="small" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ReactionDetailsModal.propTypes = {
  message: PropTypes.object.isRequired,
  initialEmoji: PropTypes.string,
  authenticatedUserUsername: PropTypes.string,
  handleEmojiClick: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ReactionDetailsModal;
