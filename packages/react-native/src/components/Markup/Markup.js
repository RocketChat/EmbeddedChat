import React from 'react';
import CodeBlock from './blocks/CodeBlock';
import BigEmoji from './elements/BigEmoji';
import HeadingBlock from './blocks/HeadingBlock';
import OrderedListBlock from './blocks/OrderedListBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import UnOrderedListBlock from './blocks/UnOrderedListBlock';
import QuoteBlock from './blocks/QuoteBlock';
import TaskListBlock from './blocks/TaskListBlock';
import Divider from './elements/Divider';

const Markup = ({ tokens }) =>
  tokens.map((token, index) => {
    switch (token.type) {
      case 'PARAGRAPH':
        return <ParagraphBlock key={index} value={token.value} />;

      case 'CODE':
        return <CodeBlock key={index} value={token.value} />;

      case 'BIG_EMOJI':
        return <BigEmoji key={index} value={token.value} />;

      case 'HEADING':
        return (
          <HeadingBlock
            key={index}
            value={token.value}
            level={token.level}
          />
        );

      case 'UNORDERED_LIST':
        return <UnOrderedListBlock key={index} value={token.value} />;

      case 'ORDERED_LIST':
        return <OrderedListBlock key={index} value={token.value} />;

      case 'TASKS':
        return <TaskListBlock key={index} value={token.value} />;

      case 'QUOTE':
        return <QuoteBlock key={index} value={token.value} />;

      case 'LINE_BREAK':
        return <Divider key={index}/>;

      default:
        return null;
    }
  });

export default Markup;
