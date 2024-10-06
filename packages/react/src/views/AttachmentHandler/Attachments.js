import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Attachment from './Attachment';
import RCContext from '../../context/RCInstance';

const Attachments = ({ attachments, type, variantStyles = {} }) => {
  const { RCInstance } = useContext(RCContext);
  let host = RCInstance.getHost();
  host = host.replace(/\/$/, '');

  return attachments.map((attachment, idx) => (
    <Attachment
      key={idx}
      attachment={attachment}
      host={host}
      variantStyles={variantStyles}
      type={type}
    />
  ));
};

export default Attachments;

Attachments.propTypes = {
  attachment: PropTypes.object,
};
