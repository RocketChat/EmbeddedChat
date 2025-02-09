import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Icon, ActionButton, Heading } from '@embeddedchat/ui-elements';
import useDynamicHeaderStyles from './DynamicHeader.styles';
import { Markdown } from '../Markdown';

const DynamicHeader = ({
  title,
  isHeaderIcon = false,
  handleClose = () => {},
  iconName,
  headerIconName,
}) => {
  const messageDescription = (msg) => {
    if (msg.file) {
      if (msg.attachments[0]?.description) {
        return (
          <Markdown
            body={msg.attachments[0].description}
            md={msg.attachments[0].descriptionMd}
            isReaction={false}
          />
        );
      }
      return msg.file.name;
    }
    return <Markdown body={msg} md={msg.md} isReaction={false} />;
  };

  const styles = useDynamicHeaderStyles();
  return (
    <Box css={styles.container}>
      <Box
        css={css`
          display: flex;
          align-items: center;
          flex-direction: row;
          gap: 0.5rem;
        `}
      >
        <ActionButton
          onClick={handleClose}
          ghost
          display="inline"
          square
          size="small"
        >
          <Icon name={iconName} size="1.25rem" />
        </ActionButton>

        <Heading level={5} css={styles.clearSpacing}>
          {messageDescription(title)}
        </Heading>
        {isHeaderIcon && <Icon name={headerIconName} size="1.25rem" />}
      </Box>
    </Box>
  );
};

export default DynamicHeader;

DynamicHeader.propTypes = {
  handleClose: PropTypes.func,
  title: PropTypes.string,
  isHeaderIcon: PropTypes.bool,
  iconName: PropTypes.string,
};
