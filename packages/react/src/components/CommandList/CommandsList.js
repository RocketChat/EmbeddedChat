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
  const classNameCommandsList = css`
    display: block;
    max-height: 10rem;
    overflow: scroll;
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
            style={{ cursor: 'pointer' }}
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
            {command.command}
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
