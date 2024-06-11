import React, { useEffect, useCallback } from 'react';
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
  ...props
}) {
  const { classNames, styleOverrides } = useComponentOverrides('CommandsList');
  const styles = useCommandListStyles();
  const { colors } = useCustomTheme();

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
      if (event.key === 'Enter') {
        const selectedItem = filteredCommands[commandIndex];
        handleCommandClick(selectedItem);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [commandIndex, filteredCommands, handleCommandClick]);

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
