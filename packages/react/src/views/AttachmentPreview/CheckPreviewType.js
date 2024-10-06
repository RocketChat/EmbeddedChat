import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useToastBarDispatch } from '@embeddedchat/ui-elements';
import PreviewImage from './PreviewType/image';
import PreviewAudio from './PreviewType/audio';
import PreviewDefault from './PreviewType/default';

const CheckPreviewType = ({ data }) => {
  const type = data ? data.type.split('/')[0] : '';

  const [previewURL, setPreviewURL] = useState('');
  const dispatchToastMessage = useToastBarDispatch();

  useEffect(() => {
    if (!data) {
      dispatchToastMessage({
        type: 'error',
        message: 'Media Type Not Accepted',
      });
    }
  }, [data, dispatchToastMessage]);

  if (!data) {
    return null;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    setPreviewURL(e.target.result);
  };
  reader.readAsDataURL(data);

  switch (type) {
    case 'image': {
      const size = data.size / 1000;
      if (size >= 10000) {
        return <PreviewDefault data={data} />;
      }
      return <PreviewImage previewURL={previewURL} />;
    }

    case 'audio':
      return <PreviewAudio previewURL={previewURL} />;

    default:
      return <PreviewDefault data={data} />;
  }
};

export default CheckPreviewType;

CheckPreviewType.propTypes = {
  data: PropTypes.object,
};
