import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { css } from '@emotion/react';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import RCContext from '../../context/RCInstance';
import useMessageStore from '../../store/messageStore';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';

const audioDot = css`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: red;
  margin: auto;
  margin-right: 8px;
`;

const audioBox = css`
  display: flex;
`;

const timer = css`
  margin: auto;
`;

const record = css`
  display: flex;
  margin: auto;
`;

const AudioMessageRecorder = () => {
  const videoRef = useRef(null);
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
  const onStop = (audioChunks) => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
    const fileName = 'Audio record.mp3';
    setFile(new File([audioBlob], fileName, { type: 'audio/mpeg' }));
  };

  const [start, stop] = useMediaRecorder({
    constraints: { audio: true, video: false },
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
      start();
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

  if (state === 'idle') {
    return (
      <ActionButton ghost square onClick={handleRecordButtonClick}>
        <Icon size="1.25rem" name="mic" />
      </ActionButton>
    );
  }

  return (
    <Box css={audioBox}>
      {state === 'recording' && (
        <>
          <ActionButton ghost onClick={handleCancelRecordButton}>
            <Icon size="1.25rem" name="circle-cross" />
          </ActionButton>
          <Box css={record}>
            <span css={audioDot} />
            <span css={timer}>{time}</span>
          </Box>
          <ActionButton ghost onClick={handleStopRecordButton}>
            <Icon name="circle-check" size="1.25rem" />
          </ActionButton>
        </>
      )}
    </Box>
  );
};

export default AudioMessageRecorder;

AudioMessageRecorder.propTypes = {};
