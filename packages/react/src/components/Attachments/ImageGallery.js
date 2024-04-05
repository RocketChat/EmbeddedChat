import React, { useEffect, useState } from 'react';
import { useRCContext } from '../../context/RCInstance';
import { Box } from '../Box';
import { Swiper, SwiperSlide } from './Swiper';
import classes from './ImageGallery.module.css';
import { Throbber } from '../Throbber';
import { ActionButton } from '../ActionButton';
import { Icon } from '../Icon';

const ImageGallery = ({ currentFileId, setShowGallery }) => {
  const { RCInstance } = useRCContext();
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllImages = async () => {
      const res = await RCInstance.getAllImages();
      if (res?.files) {
        setFiles(res.files);
        const fileIndex = res.files.findIndex(
          (file) => file._id === currentFileId
        );
        setCurrentFileIndex(fileIndex);
        setLoading(false);
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
        size="large"
      >
        <Icon name="cross" />
      </ActionButton>
      {loading ? (
        <Throbber />
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
