import React from 'react';
import PropTypes from 'prop-types';
import Attachment from './Attachment';

const Attachments = ({ attachments }) =>
  attachments.map((attachment, idx) => (
    <Attachment key={idx} attachment={attachment} />
  ));

export default Attachments;

Attachments.propTypes = {
  attachment: PropTypes.object,
};
