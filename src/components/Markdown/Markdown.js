import React from 'react'
import './Markdown.css'
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Box } from '@rocket.chat/fuselage';
import EmojiOne from 'emoji-toolkit';
import PropTypes from "prop-types";

function emojify(message) {
  return EmojiOne.toImage(message);
};

const Markdown = (props) => {
  return (
    <Box
      dangerouslySetInnerHTML={{
        __html: emojify(DOMPurify.sanitize(marked.parse(props.body))),
      }}
    ></Box>
  )
}

export default Markdown

Markdown.propTypes = {
  body: PropTypes.string,
};
