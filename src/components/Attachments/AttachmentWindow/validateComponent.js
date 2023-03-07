import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PreviewImage from './preview/image';
import PreviewAudio from './preview/audio';
import PreviewDefault from './preview/default';

const ValidateComponent = ({ data }) => {
  const type = data.type.split('/')[0];

  const [previewURL, setPreviewURL] = useState('');

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

export default ValidateComponent;

ValidateComponent.propTypes = {
  data: PropTypes.object,
};
