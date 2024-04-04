import React, { useEffect, useState } from 'react';
import { useRCContext } from '../../context/RCInstance';
import { Box } from '../Box';
import { Swiper, SwiperSlide } from './Swiper';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import classes from './Attachment.module.css';

const ImageGallery = ({ host, attachment, currentFileId }) => {
  const { RCInstance } = useRCContext();
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  useEffect(() => {
    const fetchAllFiles = async () => {
      const res = await RCInstance.getAllFiles();
      if (res?.files) {
        const sortedFiles = res.files.sort(
          (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
        setFiles(sortedFiles);

        const fileIndex = sortedFiles.findIndex(
          (file) => file.id === currentFileId
        );
        setCurrentFileIndex(fileIndex);
      }
    };
    fetchAllFiles();
  }, [RCInstance, setFiles, setCurrentFileIndex]);

  return (
    <Box className={classes.overlay}>
      <Box className={classes.wrapper}>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          initialSlide={currentFileIndex}
        >
          <SwiperSlide>
            <img
              src={host + attachment.title_link}
              style={{ width: '100%', objectFit: 'contain' }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={host + attachment.image_url}
              style={{ width: '100%', objectFit: 'contain' }}
            />
          </SwiperSlide>
        </Swiper>
      </Box>
    </Box>
  );
};

export default ImageGallery;
