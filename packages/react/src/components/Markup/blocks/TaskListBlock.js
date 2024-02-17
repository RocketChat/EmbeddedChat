import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import InlineElements from '../elements/InlineElements';
import { CheckBox } from '../../CheckBox';

const LiCss = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5em;
`;
const TaskListBlock = ({ tasks }) => (
  <ul className="task-list">
    {tasks.map((item, index) => (
      <li key={index} css={LiCss}>
        <CheckBox checked={item.status} style={{ alignSelf: 'baseline' }} />
        <InlineElements contents={item.value} />
      </li>
    ))}
  </ul>
);

export default TaskListBlock;

TaskListBlock.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object),
};
