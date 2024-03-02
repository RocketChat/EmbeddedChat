import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { format } from 'date-fns';
import { useUserStore } from '../../store';
import { Icon } from '../Icon';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';

const FilePreviewHeaderCss = css`
  display: flex;
  overflow-x: hidden;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 1;
  min-width: 1px;
  padding-right: 3px;
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
  margin-block: 0.125rem;
  gap: 0.125rem;
  align-items: center;
  max-width: 85%;
`;

const FilePreviewHeaderNameCss = css`
  letter-spacing: 0rem;
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
  color: #2f343d;
`;

const FilePreviewHeaderTimestapCss = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0rem;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  flex-shrink: 0;
  color: #9ea2a8;
`;

const FilePreviewHeader = ({ file, isTimeStamped = true }) => {
   const { styleOverrides, classNames } = useComponentOverrides('MessageHeader');
   const authenticatedUserId = useUserStore((state) => state.userId);
   const isStarred =
      file.starred && file.starred.find((u) => u._id === authenticatedUserId);

   return (
      <Box
         css={FilePreviewHeaderCss}
         className={appendClassNames('ec-file-header', classNames)}
         style={styleOverrides}
      >
         <Box
            is="span"
            css={FilePreviewHeaderNameCss}
            className={appendClassNames('ec-file-header-name')}
         >
            {file.name}
         </Box>

         {isTimeStamped && (
            <Box
               is="span"
               css={FilePreviewHeaderTimestapCss}
               className={appendClassNames('ec-file-header-timestamp')}
            >
               {format(new Date(file.ts), 'h:mm a')}
            </Box>
         )}
         {isStarred ? (
            <Icon
               style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
               name="star-filled"
               size="1em"
            />
         ) : null}
      </Box>
   );
};

export default FilePreviewHeader;

FilePreviewHeader.propTypes = {
   file: PropTypes.any,
};
