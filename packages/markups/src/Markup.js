import PropTypes from 'prop-types';
import React from 'react';
import CodeBlock from './elements/CodeBlock';
import BigEmoji from './elements/BigEmoji';
import HeadingBlock from './blocks/HeadingBlock';
import OrderedListBlock from './blocks/OrderedListBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import UnOrderedListBlock from './blocks/UnOrderedListBlock';
import QuoteBlock from './blocks/QuoteBlock';
import TaskListBlock from './blocks/TaskListBlock';
import KatexErrorBoundary from './katex/KatexErrorBoundary';
import KatexBlock from './katex/KatexBlock';

const Markup = ({ tokens }) =>
  tokens.map((token, index) => {
    switch (token.type) {
      case 'PARAGRAPH':
        return <ParagraphBlock key={index} contents={token.value} />;

      case 'CODE':
        return <CodeBlock key={index} lines={token.value} />;

      case 'BIG_EMOJI':
        return <BigEmoji key={index} contents={token.value} />;

      case 'HEADING':
        return (
          <HeadingBlock
            key={index}
            contents={token.value}
            level={token.level}
          />
        );

      case 'UNORDERED_LIST':
        return <UnOrderedListBlock key={index} items={token.value} />;

      case 'ORDERED_LIST':
        return <OrderedListBlock key={index} items={token.value} />;

      case 'TASKS':
        return <TaskListBlock key={index} tasks={token.value} />;

      case 'QUOTE':
        return <QuoteBlock key={index} contents={token.value} />;

      case 'LINE_BREAK':
        return <br key={index} />;

      case 'KATEX':
        return (
          <KatexErrorBoundary code={token.value} key={index}>
            <KatexBlock code={token.value} />
          </KatexErrorBoundary>
        );

      default:
        return null;
    }
  });

export default Markup;
Markup.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.object),
};
