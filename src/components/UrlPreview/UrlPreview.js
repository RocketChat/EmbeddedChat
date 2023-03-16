import React, { useState } from 'react';
import { Box, Icon } from '@rocket.chat/fuselage';
import PropType from 'prop-types';
import UrlThumbnail from './UrlThumbnail';
import UrlDescription from './UrlDescription';
import UrlTitle from './UrlTitle';
import classes from './UrlPreview.module.css';

const UrlPreview = ({ url }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isTitleAvailable =
    url &&
    url.meta &&
    (url.meta.pageTitle || url.meta.ogTitle || url.meta.oembedTitle);
  if (!isTitleAvailable) return null;
  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        color="hint"
        fontScale="c1"
        alignItems="center"
        style={{
          gap: '1rem',
        }}
      >
        <span>Link Preview</span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className={classes.Toggler}
        >
          <Icon
            size="x16"
            name={collapsed ? 'chevron-left' : 'chevron-down'}
            color="#313131"
          />
        </button>
      </Box>
      {!collapsed && (
        <Box className={classes.UrlPreview}>
          <UrlThumbnail url={url} />
          <UrlTitle url={url} />
          <UrlDescription url={url} />
        </Box>
      )}
    </>
  );
};

export default UrlPreview;

UrlPreview.propTypes = {
  url: PropType.object,
};
