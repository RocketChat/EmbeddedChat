import React, { useEffect, useState } from 'react';
import { useRCContext } from '../../context/RCInstance';
import { Box } from '../../components/Box';
import { Swiper, SwiperSlide } from './Swiper';
import { Throbber } from '../../components/Throbber';
import { ActionButton } from '../../components/ActionButton';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import ReactPortal from '../../lib/reactPortal';
import styles from './ImageGallery.styles';

const ImageGallery = ({ currentFileId, setShowGallery }) => {
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
  }, [RCInstance, setFiles, setCurrentFileIndex]);

  return (
    <ReactPortal wrapperId="overlay-items">
      <Box css={styles.overlay}>
        <ActionButton
          ghost
          css={styles.exit}
          onClick={() => setShowGallery(false)}
          size="medium"
        >
          <Icon name="cross" />
        </ActionButton>
        {loading && (
          <Box css={styles.throbberContainer}>
            <Throbber />
          </Box>
        )}

        {imgFetchErr ? (
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
              style={{ padding: '0.5rem', color: '#FF99A2' }}
            />
            <Box
              is="span"
              style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}
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
          <Swiper
            navigation
            pagination={{ clickable: true }}
            keyboard
            initialSlide={currentFileIndex}
          >
            {files.map(({ _id, url }) => (
              <SwiperSlide key={_id}>
                <Box css={styles.imageContainer}>
                  <img src={url} css={styles.image} />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
    </ReactPortal>
  );
};

export default ImageGallery;
