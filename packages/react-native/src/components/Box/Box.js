import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { css } from '@emotion/native';
import useComponentOverrides from '../../theme/useComponentOverrides';

const Box = forwardRef(
  (
    { children = null, style = {}, ...props },
    ref
  ) => {
    const { styleOverrides } = useComponentOverrides('Box', style);
    const styles = css`
      margin: 0;
      padding: 0;
      border-width: 0;
      box-sizing: border-box;
      border-style: solid;
      outline: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      flex: 0 1 auto;
    `;

    return (
      <View
        ref={ref}
        css={styles}
        style={styleOverrides}
        {...props}
      >
        {children}
      </View>
    );
  }
);

Box.displayName = 'Box';
export default Box;
