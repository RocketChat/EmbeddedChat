/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useCallback, useRef } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import useComponentOverrides from '../../theme/useComponentOverrides';

function CommandsList({
  className = '',
  style = {},
  commandIndex,
  filteredCommands,
  execCommand,
  onCommandClick,
  ...props
}) {
  const { classNames, styleOverrides } = useComponentOverrides('CommandsList');

  const listStyle = css`
    margin-bottom: 5px;
    display: block;
    overflow: scroll;
    overflow-x: hidden;
    max-height: 105px;
    scrollbar-width: thin;
    scrollbar-color: #e0e0e1 transparent;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #e0e0e1;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #e0e0e1;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `;

  const listItemStyle = css`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    padding-right: 2px;

    &:hover {
      background-color: #dddddd;
    }
  `;

  const commandRef = useRef(null);

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

  useEffect(() => {
    if (commandRef.current) {
      const selectedCommand = commandRef.current.children[commandIndex];
      if (selectedCommand) {
        selectedCommand.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [commandIndex]);

  return (
    <Box
      css={listStyle}
      className={`ec-commands-list ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      <ul style={{ listStyle: 'none' }} ref={commandRef}>
        {filteredCommands.map((command, index) => (
          <li
            key={command.command}
            role="presentation"
            css={listItemStyle}
            onClick={() => handleCommandClick(command)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommandClick(command);
              }
            }}
            style={{
              backgroundColor: index === commandIndex && '#dddddd',
            }}
          >
            <span style={{ justifyContent: 'space-evenly' }}>
              <span style={{ color: '#000000' }}>{command.command}</span>
              &nbsp;&nbsp;&nbsp;
              <span>{command.params}</span>
            </span>
            <span>{command.description}</span>
          </li>
        ))}
      </ul>
    </Box>
  );
}

CommandsList.propTypes = {
  commandIndex: PropTypes.any,
  filteredCommands: PropTypes.array,
  execCommand: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CommandsList;
