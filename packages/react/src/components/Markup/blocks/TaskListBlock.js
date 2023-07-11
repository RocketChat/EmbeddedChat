import { CheckBox } from '@rocket.chat/fuselage';
import React from 'react';
import PropTypes from 'prop-types';
import InlineElements from '../elements/InlineElements';

const TaskListBlock = ({ tasks }) => (
  <ul className="task-list">
    {tasks.map((item, index) => (
      <p key={index}>
        <CheckBox checked={item.status} />{' '}
        <InlineElements contents={item.value} />
      </p>
    ))}
  </ul>
);

export default TaskListBlock;

TaskListBlock.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object),
};
