import React from 'react';
import { Markup } from '../Markup';
import { Box } from '../Box';

const Markdown = ({ body }) => {

  if (!body || !body.md) return <></>;

  return (
    <Box>
      <Markup tokens={body.md} />
    </Box>
  );
};

export default Markdown;
