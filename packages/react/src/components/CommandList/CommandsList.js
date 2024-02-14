/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box } from '../Box';
import useComponentOverrides from '../../theme/useComponentOverrides';

function CommandsList({
  className = '',
  style = {},
  filteredCommands,
  execCommand,
  onCommandClick,
  ...props
}) {
  const { classNames, styleOverrides } = useComponentOverrides('CommandsList');

  const commandStyles = css`
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

  const classNameCommandsList = css`
    margin-bottom: 5px;
    display: block;
    max-height: 10rem;
    overflow: scroll;
    overflow-x: hidden;
    max-height: 145px;
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


  return (
    <Box
      css={classNameCommandsList}
      className={`ec-commands-list ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      <ul style={{ listStyle: 'none' }}>
        {filteredCommands.map((command) => (
          <li
            css={commandStyles}
            onClick={() => {
              if (execCommand) {
                execCommand(command);
              }
              if (onCommandClick) {
                onCommandClick(command);
              }
            }}
            key={command.command}
          >
            <span style={{ justifyContent: 'space-evenly' }}>
              <span style={{ color: '#000000' }}>
                {command.command}
              </span>
              &nbsp;&nbsp;&nbsp;
              <span>
                {command.params}
              </span>
            </span>
            <span>{command.description}</span>
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
