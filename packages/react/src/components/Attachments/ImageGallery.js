import React, { useEffect, useState } from 'react';
import { useRCContext } from '../../context/RCInstance';
import { Box } from '../Box';
import { Swiper, SwiperSlide } from './Swiper';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import classes from './ImageGallery.module.css';
import { Throbber } from '../Throbber';

const ImageGallery = ({ currentFileId }) => {
  const { RCInstance } = useRCContext();
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);

  useEffect(() => {
    const fetchAllImages = async () => {
      const res = await RCInstance.getAllImages();
      if (res?.files) {
        setFiles(res.files);
        const fileIndex = res.files.findIndex(
          (file) => file._id === currentFileId
        );
        setCurrentFileIndex(fileIndex);
      }
    };
    fetchAllImages();
  }, [RCInstance, setFiles, setCurrentFileIndex]);

  return (
    <Box className={classes.overlay}>
      <Box className={classes.wrapper}>
        {files.length === 0 ? (
          <Throbber />
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            initialSlide={currentFileIndex}
          >
            {files.map(({ _id, url }) => {
              return (
                <SwiperSlide id={_id}>
                  <img
                    src={url}
                    style={{ width: '100%', objectFit: 'contain' }}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </Box>
    </Box>
  );
};

export default ImageGallery;
