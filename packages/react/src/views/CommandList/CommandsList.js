import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box } from '../../components/Box';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import useCommandListStyles from './CommandList.style';
import { useCustomTheme } from '../../hooks/useCustomTheme';

function CommandsList({
  className = '',
  style = {},
  filteredCommands,
  execCommand,
  onCommandClick,
  commandIndex,
  setCommandIndex,
  ...props
}) {
  const { classNames, styleOverrides } = useComponentOverrides('CommandsList');
  const styles = useCommandListStyles();
  const { colors } = useCustomTheme();
  const itemRefs = useRef([]);
  const setItemRef = (el, index) => {
    itemRefs.current[index] = el;
  };

  const handleCommandClick = useCallback(
    (command) => {
      if (execCommand) {
        execCommand(command);
      }
      if (onCommandClick) {
        onCommandClick(command);
      }
    },
    [execCommand, onCommandClick]
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
              backgroundColor: index === commandIndex && colors.primary,
              color: index === commandIndex && colors.primaryForeground,
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
  filteredCommands: PropTypes.array,
  execCommand: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CommandsList;
