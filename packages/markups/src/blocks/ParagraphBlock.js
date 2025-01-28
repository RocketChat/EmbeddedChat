import PropTypes from 'prop-types';
import React from 'react';

const ParagraphBlock = ({ contents, searchText }) => {
  
  const highlightText = (text, searchText) => {
    if (!searchText ||typeof text !== 'string') return text;
    const regex = new RegExp(`(${escapeRegExp(searchText.text)})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };
  
  const escapeRegExp = (string) => {
    if (typeof string !== 'string') return '';
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const renderContent = (content) => {
    if (content.type === 'PLAIN_TEXT') {
      return highlightText(content.value,searchText);
    }
    return content.value;
  };

  return (
    <p>
      {contents.map((content, index) => (
        <React.Fragment key={index}>
          {renderContent(content)}
        </React.Fragment>
      ))}
    </p>
  );
};

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  contents: PropTypes.any,
};