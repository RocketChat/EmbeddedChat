import React from 'react';
import { formatDistance } from 'date-fns';
import {
  Box,
  Icon,
  useComponentOverrides,
  appendClassNames,
} from '@embeddedchat/ui-elements';
import { fileMetricsStyles as styles } from './Files.styles';

export const FileMetrics = ({ className = '', file, style = {}, ...props }) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'FileMetrics',
    className,
    style
  );
  return (
    <Box
      css={styles.metrics}
      className={appendClassNames('ec-file-metrics', classNames)}
      style={styleOverrides}
      {...props}
    >
      <Box
        css={styles.metricsItem}
        title={new Date(file?.uploadedAt).toLocaleString()}
      >
        <Icon size="1.25rem" name="clock" />
        <Box css={styles.metricsItemLabel}>
          {formatDistance(new Date(file?.uploadedAt), new Date(), {
            addSuffix: true,
          })}
        </Box>
      </Box>
    </Box>
  );
};
