import React from 'react';
import { css } from '@emotion/react';
import { formatDistance } from 'date-fns';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { Icon } from '../Icon';

const FileMetricsCss = css`
  display: flex;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  margin-inline: -0.25rem;
  margin-top: 0.5rem;
`;

const FileMetricsItemCss = css`
  letter-spacing: 0rem;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.25rem;
  color: #6c727a;
`;

const FileMetricsItemLabelCss = css`
  margin: 0.25rem;
  margin-inline-start: 0.25rem;
  white-space: nowrap;
`;

export const FileMetrics = ({
   className = '',
   file,
   style = {},
   ...props
}) => {
   const { styleOverrides, classNames } = useComponentOverrides(
      'MessageMetrics',
      className,
      style
   );
   return (
      <Box
         css={FileMetricsCss}
         className={appendClassNames('ec-message-metrics', classNames)}
         style={styleOverrides}
         {...props}
      >
         <div
            css={FileMetricsItemCss}
            title={new Date(file.uploadedAt).toLocaleString()}
         >
            <Icon size="1.25rem" name="clock" />
            <div css={FileMetricsItemLabelCss}>
               {formatDistance(new Date(file.uploadedAt), new Date(), {
                  addSuffix: true,
               })}
            </div>
         </div>
      </Box>
   );
};
