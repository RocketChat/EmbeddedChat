import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { CheckBox } from '@embeddedchat/ui-elements';
import InlineElements from '../elements/InlineElements';
import { TaskListBlockStyles as styles } from './blocks.styles';

const TaskListBlock = ({ tasks }) => (
  <ul className="task-list">
    {tasks.map((item, index) => (
      <li key={index} css={styles.li}>
        <CheckBox
          checked={item.status}
          css={css`
            align-self: baseline;
          `}
        />
        <InlineElements contents={item.value} />
      </li>
    ))}
  </ul>
);

export default TaskListBlock;

TaskListBlock.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object),
};
