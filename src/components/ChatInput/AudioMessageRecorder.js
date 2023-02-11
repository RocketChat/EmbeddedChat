import React, { useState, useEffect, useCallback } from 'react';
import { Icon, ActionButton, Box } from '@rocket.chat/fuselage';
import styles from './AudioMessage.module.css';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';

const AudioMessageRecorder = () => {
  const [state, setRecordState] = useState('idle');
  const [time, setTime] = useState('00:00');
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [isMicrophoneDenied, setIsMicrophoneDenied] = useState(false);

  const { start, stop } = useMediaRecorder({
    constraints: { audio: true, video: false },
    onStop: (audioChunks) => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
      const fileName = 'Audio record.mp3';
      const file = new File([audioBlob], fileName, { type: 'audio/mpeg' });
      console.log(file);
    },
  });

  const handleRecordButtonClick = () => {
    setRecordState('recording');
    try {
      start();
      const startTime = new Date();
      setRecordingInterval(
        setInterval(() => {
          const now = new Date();
          const distance = (now.getTime() - startTime.getTime()) / 1000;
          const minutes = Math.floor(distance / 60);
          const seconds = Math.floor(distance % 60);
          setTime(
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
              2,
              '0'
            )}`
          );
        }, 1000)
      );
    } catch (error) {
      console.log(error);
      setRecordState('idle');
    }
  };

  const handleCancelRecordButton = () => {
    stop();
  };

  const handleStopRecordButton = () => {
    stop();
  };

  const handleMount = useCallback(async () => {
    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: 'microphone',
        });
        setIsMicrophoneDenied(permissionStatus.state === 'denied');
        permissionStatus.onchange = () => {
          setIsMicrophoneDenied(permissionStatus.state === 'denied');
        };
        return;
      } catch (error) {
        console.warn(error);
      }
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setIsMicrophoneDenied(true);
      return;
    }

    try {
      if (
        !(await navigator.mediaDevices.enumerateDevices()).some(
          ({ kind }) => kind === 'audioinput'
        )
      ) {
        setIsMicrophoneDenied(true);
        return;
      }
    } catch (error) {
      console.warn(error);
    }
  });

  const handleUnmount = useCallback(async () => {
    if (state === 'recording') {
      setIsMicrophoneDenied(true);
    }
  });

  useEffect(() => {
    handleMount();

    return () => {
      handleUnmount();
    };
  }, [handleMount, handleUnmount]);

  if (state === 'idle') {
    return (
      <ActionButton
        bg="neutral-500"
        border="0px"
        onClick={handleRecordButtonClick}
      >
        <Icon name="mic" size="x20" />
      </ActionButton>
    );
  }

  return (
    <Box className={styles.audioBox}>
      {state === 'recording' && (
        <>
          <ActionButton
            bg="neutral-500"
            border="0px"
            onClick={handleCancelRecordButton}
          >
            <Icon name="circle-cross" size="x20" />
          </ActionButton>
          <Box color="default">
            <span className={styles.audioDot} />
            <span className="rc-message-box__audio-message-timer-text">
              {time}
            </span>
          </Box>
          <ActionButton
            bg="neutral-500"
            border="0px"
            onClick={handleStopRecordButton}
          >
            <Icon name="circle-check" size="x20" />
          </ActionButton>
        </>
      )}
    </Box>
  );
};

export default AudioMessageRecorder;

AudioMessageRecorder.propTypes = {};
