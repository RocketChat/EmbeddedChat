import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ActionButton,
  Icon,
  Button,
  Throbber,
  useTheme,
  ReactPortal,
} from '@embeddedchat/ui-elements';
import { useRCContext } from '../../context/RCInstance';
import { Swiper, SwiperSlide } from './Swiper';
import getImageGalleryStyles from './ImageGallery.styles';

const ImageGallery = ({ currentFileId, setShowGallery }) => {
  const { theme } = useTheme();
  const styles = getImageGalleryStyles(theme);
  const { RCInstance } = useRCContext();
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [imgFetchErr, setImgFetchErr] = useState(false);

  useEffect(() => {
    const fetchAllImages = async () => {
      const res = await RCInstance.getAllImages();
      if (res) {
        if (res?.files) {
          setFiles(res.files);
          const fileIndex = res.files.findIndex(
            (file) => file._id === currentFileId
          );
          setCurrentFileIndex(fileIndex);
          setLoading(false);
        }
      } else {
        setLoading(false);
        setImgFetchErr(true);
      }
    };
    fetchAllImages();
  }, [RCInstance, setFiles, setCurrentFileIndex, currentFileId]);

  useEffect(() => {
    const previousActiveElement = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowGallery(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (
        previousActiveElement &&
        typeof previousActiveElement.focus === 'function'
      ) {
        previousActiveElement.focus();
      }
    };
  }, [setShowGallery]);

  return (
    <ReactPortal wrapperId="overlay-items">
      <Box
        css={styles.overlay}
        role="dialog"
        aria-modal="true"
        aria-label="Image gallery"
      >
        <ActionButton
          css={styles.exit}
          onClick={() => setShowGallery(false)}
          size="medium"
          aria-label="Close image gallery"
        >
          <Icon name="cross" />
        </ActionButton>
        {loading && (
          <Box css={styles.throbberContainer}>
            <Throbber />
          </Box>
        )}

        {imgFetchErr || currentFileIndex === -1 ? (
          <Box
            css={styles.fetchErrorContainer}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Icon
              name="magnifier"
              size="3rem"
              style={{ padding: '0.5rem', color: theme.colors.destructive }}
            />
            <Box
              is="span"
              style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: theme.colors.primaryForeground,
              }}
            >
              Something went wrong
            </Box>
            <Button
              type="primary"
              onClick={() => setShowGallery(false)}
              style={{
                alignSelf: 'auto',
                margin: '10px',
              }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <Box css={styles.swiperContainer}>
            <Swiper
              navigation
              pagination={{ clickable: true }}
              keyboard
              initialSlide={currentFileIndex}
              injectStyles={[styles.swiperInject]}
            >
              {files.map(({ _id, url, name }) => (
                <SwiperSlide key={_id}>
                  <Box css={styles.imageContainer}>
                    <img
                      src={url}
                      alt={name || 'Gallery image'}
                      css={styles.image}
                    />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}
      </Box>
    </ReactPortal>
  );
};

ImageGallery.propTypes = {
  currentFileId: PropTypes.string,
  setShowGallery: PropTypes.func.isRequired,
};

export default ImageGallery;
