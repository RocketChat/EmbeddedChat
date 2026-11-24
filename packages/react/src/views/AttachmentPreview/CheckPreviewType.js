import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useToastBarDispatch } from '@embeddedchat/ui-elements';
import PreviewImage from './PreviewType/image';
import PreviewAudio from './PreviewType/audio';
import PreviewDefault from './PreviewType/default';

const CheckPreviewType = ({ data }) => {
  const type = data?.type ? data.type.split('/')[0] : '';

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

  useEffect(() => {
    if (!data) {
      setPreviewURL('');
      return undefined;
    }

    const mediaType = data.type ? data.type.split('/')[0] : '';
    const isImage = mediaType === 'image';
    const isAudio = mediaType === 'audio';
    const isImageTooLarge = isImage && data.size / 1000 >= 10000;

    if ((!isImage && !isAudio) || isImageTooLarge) {
      setPreviewURL('');
      return undefined;
    }

    let objectUrl = '';
    let isCancelled = false;

    if (
      typeof window !== 'undefined' &&
      window.URL &&
      typeof window.URL.createObjectURL === 'function'
    ) {
      try {
        objectUrl = window.URL.createObjectURL(data);
        setPreviewURL(objectUrl);
      } catch (err) {
        // Fallback to FileReader if createObjectURL is unavailable or throws
      }
    }

    if (!objectUrl && typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!isCancelled) {
          setPreviewURL(e.target?.result || '');
        }
      };
      reader.readAsDataURL(data);
    }

    return () => {
      isCancelled = true;
      if (
        objectUrl &&
        typeof window !== 'undefined' &&
        window.URL?.revokeObjectURL
      ) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [data]);

  if (!data) {
    return null;
  }

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
