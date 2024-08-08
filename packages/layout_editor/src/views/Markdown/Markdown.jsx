import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Box } from "@embeddedchat/ui-elements";
import { Markup, MarkupInteractionContext } from "@embeddedchat/markups";

const Markdown = ({ body }) => {
  const username = "spiral_memory";

  const value = useMemo(() => {
    const members = [];

    return { members, username };
  }, [username]);

  return (
    <Box>
      <MarkupInteractionContext.Provider value={value}>
        <Markup tokens={body.md} />
      </MarkupInteractionContext.Provider>
    </Box>
  );
};

Markdown.propTypes = {
  body: PropTypes.any,
  isReaction: PropTypes.bool,
};

export default Markdown;
