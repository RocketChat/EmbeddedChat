import { ActionButton, Box, Icon, Menu } from '@rocket.chat/fuselage';
import React from 'react';
import styles from './ChatHeader.module.css';
import PropTypes from 'prop-types';

const ChatHeader = ({
  isClosable,
  setClosableState,
  moreOpts,
  fullScreen,
  setFullScreen,
}) => {
  return (
    <Box className={styles.container} border="1px solid #b1b1b1" p={10}>
      <Box display="flex">
        <Icon name="hash" size={fullScreen ? 'x40' : 'x30'} />
        <Box margin={'0 1rem'}>
          <h2 className={styles.nospace}>channelName</h2>
          {fullScreen && (
            <p
              className={styles.nospace}
              style={{ color: 'gray', fontSize: 14 }}
            >
              this is channel description, i like it
            </p>
          )}
        </Box>
      </Box>
      <Box>
        {fullScreen ? (
          moreOpts && (
            <Menu
              margin={'0 4px'}
              display={'inline'}
              options={{
                minimize: {
                  action: () => setFullScreen((prev) => !prev),
                  label: (
                    <Box alignItems="center" display="flex">
                      <Icon mie="x4" name="mobile" size="x16" />
                      Minimize
                    </Box>
                  ),
                },
                threads: {
                  action: function noRefCheck() {},
                  label: (
                    <Box alignItems="center" display="flex">
                      <Icon mie="x4" name="thread" size="x16" />
                      Threads
                    </Box>
                  ),
                },
                starred: {
                  action: function noRefCheck() {},
                  label: (
                    <Box alignItems="center" display="flex">
                      <Icon mie="x4" name="star" size="x16" />
                      Starred
                    </Box>
                  ),
                },
                pinned: {
                  action: function noRefCheck() {},
                  label: (
                    <Box alignItems="center" display="flex">
                      <Icon mie="x4" name="pin" size="x16" />
                      Pinned
                    </Box>
                  ),
                },
              }}
            />
          )
        ) : (
          <ActionButton
            onClick={() => {
              setFullScreen((prev) => !prev);
            }}
            ghost
            display={'inline'}
            square
            small
          >
            <Icon name="computer" size={'x20'} />
          </ActionButton>
        )}
        {isClosable && (
          <ActionButton
            onClick={() => {
              setClosableState((prev) => !prev);
            }}
            ghost
            display={'inline'}
            square
            small
          >
            <Icon name="cross" size={'x20'} />
          </ActionButton>
        )}
      </Box>
    </Box>
  );
};

export default ChatHeader;

ChatHeader.propTypes = {
  isClosable: PropTypes.bool,
  fullScreen: PropTypes.bool,
  setClosableState: PropTypes.func,
  setFullScreen: PropTypes.func,
  moreOpts: PropTypes.bool,
};
