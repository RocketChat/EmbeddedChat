import React from 'react';
import * as UiKit from '@rocket.chat/ui-kit';
import { Grid } from '@embeddedchat/ui-elements';

const breakpoints = {
  xs: 4,
  sm: 4,
  md: 4,
  lg: 6,
  xl: 6,
};

const Fields = ({ fields, surfaceRenderer }) => (
  <Grid>
    {fields.map((field, i) => (
      <Grid.Item {...breakpoints} key={i}>
        {surfaceRenderer.renderTextObject(field, 0, UiKit.BlockContext.NONE)}
      </Grid.Item>
    ))}
  </Grid>
);

export default Fields;
