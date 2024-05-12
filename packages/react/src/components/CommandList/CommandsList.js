/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box } from '../Box';
import useComponentOverrides from '../../theme/useComponentOverrides';
import styles from './CommandList.style';

function CommandsList({
  className = '',
  style = {},
  filteredCommands,
  execCommand,
  onCommandClick,
  ...props
}) {
  const { classNames, styleOverrides } = useComponentOverrides('CommandsList');

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
        const selectedItem = filteredCommands[0];
        handleCommandClick(selectedItem);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [filteredCommands, handleCommandClick]);

  return (
    <Box
      css={styles.list}
      className={`ec-commands-list ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      <ul
        css={css`
          liststyle: none;
        `}
      >
        {filteredCommands.map((command) => (
          <li
            key={command.command}
            css={styles.listItem}
            onClick={() => handleCommandClick(command)}
          >
            <Box
              is="span"
              css={css`
                justify-content: space-evenly;
              `}
            >
              <Box
                is="span"
                css={css`
                  color: #000000;
                `}
              >
                {command.command}
              </Box>
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
