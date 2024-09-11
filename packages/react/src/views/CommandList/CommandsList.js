import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import {
  Box,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import getCommandListStyles from './CommandList.style';

function CommandsList({
  className = '',
  style = {},
  messageRef,
  setFilteredCommands,
  filteredCommands,
  execCommand,
  commandIndex,
  setCommandIndex,
  setShowCommandList,
  ...props
}) {
  const { classNames, styleOverrides } = useComponentOverrides('CommandsList');
  const { theme } = useTheme();
  const styles = getCommandListStyles(theme);
  const itemRefs = useRef([]);
  const setItemRef = (el, index) => {
    itemRefs.current[index] = el;
  };

  const handleCommandClick = useCallback(
    async (command) => {
      const commandName = command.command;
      const currentMessage = messageRef.current.value;
      const tokens = (currentMessage || '').split(' ');
      const firstTokenIdx = tokens.findIndex((token) => token.match(/^\/\w*$/));
      if (firstTokenIdx !== -1) {
        tokens[firstTokenIdx] = `/${commandName}`;
        const newMessageString = tokens.join(' ');
        messageRef.current.value = newMessageString;
        setFilteredCommands([]);
        setCommandIndex(0);
        setShowCommandList(false);
      }
    },
    [messageRef, setCommandIndex, setFilteredCommands, setShowCommandList]
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'Enter': {
          const selectedItem = filteredCommands[commandIndex];
          handleCommandClick(selectedItem);
          break;
        }
        case 'ArrowDown':
          event.preventDefault();
          setCommandIndex(
            commandIndex + 1 >= filteredCommands.length ? 0 : commandIndex + 1
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setCommandIndex(
            commandIndex - 1 < 0
              ? filteredCommands.length - 1
              : commandIndex - 1
          );
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [commandIndex, filteredCommands, handleCommandClick, setCommandIndex]);

  useEffect(() => {
    if (itemRefs.current[commandIndex]) {
      itemRefs.current[commandIndex].scrollIntoView({
        block: 'nearest',
      });
    }
  }, [commandIndex]);

  return (
    <Box
      css={styles.main}
      className={`ec-commands-list ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {filteredCommands.map((command, index) => (
          <li
            key={command.command}
            role="presentation"
            css={styles.listItem}
            ref={(el) => setItemRef(el, index)}
            onClick={() => handleCommandClick(command)}
            style={{
              backgroundColor: index === commandIndex && theme.colors.primary,
              color: index === commandIndex && theme.colors.primaryForeground,
            }}
          >
            <Box
              is="span"
              css={css`
                justify-content: space-evenly;
              `}
            >
              <Box is="span">{command.command}</Box>
              &nbsp;&nbsp;&nbsp;
              <Box is="span">{command.params}</Box>
            </Box>
            <Box>{command.description}</Box>
          </li>
        ))}
      </ul>
    </Box>
  );
}

CommandsList.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  messageRef: PropTypes.object.isRequired,
  setFilteredCommands: PropTypes.func.isRequired,
  filteredCommands: PropTypes.array,
  execCommand: PropTypes.func,
  commandIndex: PropTypes.number.isRequired,
  setCommandIndex: PropTypes.func.isRequired,
  setShowCommandList: PropTypes.func.isRequired,
};

export default CommandsList;
