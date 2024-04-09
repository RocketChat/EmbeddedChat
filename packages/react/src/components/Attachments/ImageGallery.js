import React, { useEffect, useState } from 'react';
import { useRCContext } from '../../context/RCInstance';
import { Box } from '../Box';
import { Swiper, SwiperSlide } from './Swiper';
import classes from './ImageGallery.module.css';
import { Throbber } from '../Throbber';
import { ActionButton } from '../ActionButton';
import { Icon } from '../Icon';
import { Button } from '../Button';

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
    <Box className={classes.overlay}>
      <ActionButton
        ghost
        className={classes.exit}
        onClick={() => setShowGallery(false)}
        size="medium"
      >
        <Icon name="cross" />
      </ActionButton>
      {loading && (
        <Box className={classes.throbberWrapper}>
          <Throbber />
        </Box>
      )}

      {imgFetchErr ? (
        <Box
          className={classes.fetchErrorWrapper}
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
          <span
            style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}
          >
            Something went wrong
          </span>
          <Button
            color="primary"
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
            <SwiperSlide key={_id} className={classes.slide}>
              <Box className={classes.imageWrapper}>
                <img src={url} className={classes.image} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
};

export default ImageGallery;
