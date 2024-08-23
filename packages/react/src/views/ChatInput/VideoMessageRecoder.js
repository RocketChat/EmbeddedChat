import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Icon,
  ActionButton,
  Modal,
  useTheme,
} from '@embeddedchat/ui-elements';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import RCContext from '../../context/RCInstance';
import useMessageStore from '../../store/messageStore';
import { getCommonRecorderStyles } from './ChatInput.styles';

const VideoMessageRecorder = () => {
  const videoRef = useRef(null);
  const { theme } = useTheme();
  const styles = getCommonRecorderStyles(theme);

  const toogleRecordingMessage = useMessageStore(
    (state) => state.toogleRecordingMessage
  );

  const { RCInstance, ECOptions } = useContext(RCContext);
  const [state, setRecordState] = useState('idle');
  const [time, setTime] = useState('00:00');
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [file, setFile] = useState(null);
  const [isRecorded, setIsRecorded] = useState(false);
  const threadId = useMessageStore((_state) => _state.threadMainMessage?._id);

  const onStop = (videoChunks) => {
    const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
    const fileName = 'Video record.mp4';
    setFile(new File([videoBlob], fileName, { type: 'video/mp4' }));
  };

  const [start, stop] = useMediaRecorder({
    constraints: { audio: true, video: true }, // Update constraints as needed
    onStop,
    videoRef,
  });

  const stopRecording = async () => {
    stop();
    if (recordingInterval) {
      clearInterval(recordingInterval);
    }
    setRecordingInterval(null);
    setTime('00:00');
    setRecordState('idle');
  };

  const handleRecordButtonClick = () => {
    setRecordState('recording');
    try {
      start(videoRef.current);
      toogleRecordingMessage();
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

  const handleCancelRecordButton = async () => {
    toogleRecordingMessage();
    await stopRecording();
    setIsRecorded(false);
  };

  const handleStopRecordButton = async () => {
    toogleRecordingMessage();
    setIsRecorded(true);
    await stopRecording();
  };

  const handleMount = useCallback(async () => {
    if (navigator.permissions) {
      try {
        await navigator.permissions.query({
          name: 'microphone',
        });
        await navigator.permissions.query({
          name: 'camera',
        });
        return;
      } catch (error) {
        console.warn(error);
      }
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return;
    }

    try {
      if (
        !(await navigator.mediaDevices.enumerateDevices()).some(
          ({ kind }) => kind === 'audioinput'
        ) &&
        !(await navigator.mediaDevices.enumerateDevices()).some(
          ({ kind }) => kind === 'videoinput'
        )
      ) {
        return null;
      }
    } catch (error) {
      console.warn(error);
    }
  });

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  useEffect(() => {
    const sendRecording = async () => {
      await RCInstance.sendAttachment(
        file,
        undefined,
        undefined,
        ECOptions.enableThreads ? threadId : undefined
      );
    };
    if (isRecorded && file) {
      sendRecording();
      setIsRecorded(false);
    }
    if (file) {
      setFile(null);
    }
  }, [isRecorded, file]);

  return (
    <>
      {state === 'idle' && (
        <ActionButton ghost square onClick={handleRecordButtonClick}>
          <Icon size="1.25rem" name="video-recorder" />
        </ActionButton>
      )}

      {state === 'recording' && (
        <>
          <ActionButton ghost square>
            <Icon size="1.25rem" name="disabled-recorder" />
          </ActionButton>
          <Modal
            open={state === 'recording'}
            onClose={handleCancelRecordButton}
            style={{
              display: 'flex',
              width: '28rem',
            }}
          >
            <video
              muted
              autoPlay
              playsInline
              ref={videoRef}
              css={css`
                margin-bottom: 2px;
              `}
            />
            <Box css={styles.controller}>
              <ActionButton ghost onClick={handleCancelRecordButton}>
                <Icon size="1.25rem" name="circle-cross" />
              </ActionButton>
              <Box css={styles.record}>
                <Box is="span" css={styles.dot} />
                <Box css={styles.timer}>{time}</Box>
              </Box>
              <ActionButton ghost onClick={handleStopRecordButton}>
                <Icon name="circle-check" size="1.25rem" />
              </ActionButton>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default VideoMessageRecorder;
