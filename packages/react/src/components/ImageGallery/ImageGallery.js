import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useRCContext } from '../../context/RCInstance';
import { Box } from '../Box';
import { Swiper, SwiperSlide } from './Swiper';
import { Throbber } from '../Throbber';
import { ActionButton } from '../ActionButton';
import { Icon } from '../Icon';
import { Button } from '../Button';

const overlay = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(51, 51, 51, 0.7);
`;

const exit = css`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #fff;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  z-index: 1001;
`;

const imageWrapper = css`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const image = css`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const throbberWrapper = css`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const fetchErrorWrapper = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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
    <Box css={overlay}>
      <ActionButton
        ghost
        css={exit}
        onClick={() => setShowGallery(false)}
        size="medium"
      >
        <Icon name="cross" />
      </ActionButton>
      {loading && (
        <Box css={throbberWrapper}>
          <Throbber />
        </Box>
      )}

      {imgFetchErr ? (
        <Box
          css={fetchErrorWrapper}
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
            <SwiperSlide key={_id}>
              <Box css={imageWrapper}>
                <img src={url} css={image} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
};

export default ImageGallery;
