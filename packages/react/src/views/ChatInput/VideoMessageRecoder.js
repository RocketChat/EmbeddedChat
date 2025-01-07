import React, { useState, useEffect, useCallback, useRef } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Icon,
  ActionButton,
  Button,
  Modal,
  useTheme,
  lighten,
  darken,
} from '@embeddedchat/ui-elements';
import { useNewMediaRecorder } from '../../hooks/useMediaRecorder';
import { getCommonRecorderStyles } from './ChatInput.styles';
import useAttachmentWindowStore from '../../store/attachmentwindow';

const VideoMessageRecorder = ({ disabled }) => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const { theme } = useTheme();
  const { mode } = useTheme();
  const styles = getCommonRecorderStyles(theme);

  const [state, setRecordState] = useState('idle'); // 1. idle, 2. preview.
  const [time, setTime] = useState('00:00');
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [file, setFile] = useState(null);
  const [isSendDisabled, setIsSendDisabled] = useState(true);

  const { toggle, setData } = useAttachmentWindowStore((state_) => ({
    toggle: state_.toggle,
    setData: state_.setData,
  }));

  const {
    startCameraAndMic,
    startRecording,
    stopRecording,
    deleteRecording,
    stopCameraAndMic,
  } = useNewMediaRecorder({
    constraints: { video: true, audio: true },
    videoRef,
    onStop: (videoChunks) => {
      const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
      const fileName = 'Video record.mp4';
      setFile(new File([videoBlob], fileName, { type: 'video/mp4' }));
    },
  });

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

  const startRecordingInterval = () => {
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
  };

  const stopRecordingInterval = () => {
    if (recordingInterval) {
      clearInterval(recordingInterval);
    }
    setRecordingInterval(null);
  };

  const deleteRecordingInterval = () => {
    stopRecordingInterval();
    setTime('00:00');
  };

  const openWindowToRecord = () => {
    startCameraAndMic();
    setRecordState('preview');
  };

  const handleStartRecording = () => {
    deleteRecordingInterval();
    setIsRecording(true);
    startRecording();
    startRecordingInterval();
    setIsSendDisabled(true);
  };

  const handleStopRecording = () => {
    stopRecording();
    stopRecordingInterval();
    setIsRecording(false);
    setIsSendDisabled(false);
  };

  const handleSendRecording = () => {
    if (file) {
      toggle();
      setData(file);
    }
    deleteRecordingInterval();
    deleteRecording();
    stopCameraAndMic();
    setRecordState('idle');
    setIsSendDisabled(true);
  };

  const closeWindowStopRecord = () => {
    stopRecording();
    deleteRecordingInterval();
    deleteRecording();
    stopCameraAndMic();
    setRecordState('idle');
    setIsSendDisabled(true);
  };

  return (
    <>
      {state === 'idle' && (
        <ActionButton
          ghost
          square
          disabled={disabled}
          onClick={openWindowToRecord}
        >
          <Icon size="1.25rem" name="video-recorder" />
        </ActionButton>
      )}

      {state === 'preview' && (
        <>
          <ActionButton ghost square>
            <Icon size="1.25rem" name="disabled-recorder" />
          </ActionButton>
          <Modal
            open={state === 'preview'}
            onClose={closeWindowStopRecord}
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
              <Box css={styles.leftSection}>
                <ActionButton
                  ghost
                  onClick={
                    isRecording ? handleStopRecording : handleStartRecording
                  }
                  css={css`
                    margin-top: 0.3rem;
                  `}
                >
                  <Icon
                    name={isRecording ? 'stop-record' : 'record'}
                    size="1.25rem"
                  />
                </ActionButton>
                <Box css={styles.record}>
                  <Box
                    is="span"
                    css={isRecording ? styles.dot : styles.oppositeDot}
                  />
                  <Box css={styles.timer}>{time}</Box>
                </Box>
              </Box>

              <Box css={styles.spacer} />

              <Box css={styles.rightSection}>
                <Button onClick={closeWindowStopRecord}>Cancel</Button>
                <Button
                  onClick={handleSendRecording}
                  disabled={isSendDisabled}
                  css={css`
                    margin-left: 5px;
                  `}
                  style={{
                    backgroundColor: (() => {
                      if (isSendDisabled) {
                        return mode === 'light'
                          ? darken(theme.colors.background, 0.2)
                          : lighten(theme.colors.background, 4);
                      }
                      return mode === 'light'
                        ? theme.colors.info
                        : theme.colors.warningForeground;
                    })(),

                    color: isSendDisabled
                      ? mode === 'light'
                        ? theme.colors.foreground
                        : theme.colors.background
                      : mode === 'light'
                      ? theme.colors.background
                      : theme.colors.background,
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default VideoMessageRecorder;
