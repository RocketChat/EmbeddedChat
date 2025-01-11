import { useState, useRef, useEffect } from 'react';

function useUserMedia(constraints, videoRef) {
  const [stream, setStream] = useState();
  async function getStream(refresh = false) {
    if (stream && !refresh) {
      return stream;
    }
    const _stream = await navigator.mediaDevices.getUserMedia(constraints);
    setStream(_stream);

    // Optionally, set the stream as the srcObject of the video element
    if (videoRef.current) {
      videoRef.current.srcObject = _stream;
    }

    return _stream;
  }
  return { stream, getStream };
}

export function useMediaRecorder({ constraints, onStop, videoRef }) {
  const [recorder, setRecorder] = useState();
  const { getStream } = useUserMedia(constraints, videoRef);
  const chunks = useRef([]);

  async function start() {
    const stream = await getStream(constraints, true);
    chunks.current = [];
    const _recorder = new MediaRecorder(stream);
    _recorder.start();
    setRecorder(_recorder);
    _recorder.addEventListener('dataavailable', (event) => {
      chunks.current.push(event.data);
    });
    _recorder.addEventListener('stop', () => {
      onStop && onStop(chunks.current);
    });
  }

  async function stop() {
    if (recorder) {
      recorder.stop();
      (await getStream()).getTracks().forEach((track) => track.stop());
    }
  }

  return [start, stop];
}

export function useNewMediaRecorder({ constraints, videoRef, onStop }) {
  const [stream, setStream] = useState();
  const [isStreaming, setIsStreaming] = useState(false);
  const [recorder, setRecorder] = useState();
  const [recordingData, setRecordingData] = useState(null);
  const chunks = useRef([]);

  async function startCameraAndMic() {
    if (isStreaming) return;
    try {
      const _stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(_stream);
      setIsStreaming(true);
      if (videoRef.current) {
        videoRef.current.srcObject = _stream;
      }
    } catch (error) {
      console.error('Error starting camera and mic:', error);
    }
  }

  async function startRecording() {
    if (!isStreaming) {
      console.error('Camera and mic must be on to start recording.');
      return;
    }

    chunks.current = [];
    const _recorder = new MediaRecorder(stream);
    _recorder.start();
    setRecorder(_recorder);

    _recorder.addEventListener('dataavailable', (event) => {
      chunks.current.push(event.data);
    });

    _recorder.addEventListener('stop', () => {
      setRecordingData(new Blob(chunks.current, { type: 'video/mp4' }));
      onStop && onStop(chunks.current);
    });
  }

  async function stopRecording() {
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    }
  }

  function getRecording() {
    return recordingData;
  }

  function deleteRecording() {
    setRecordingData(null);
    chunks.current = [];
  }

  function stopCameraAndMic() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }

  useEffect(() => () => stopCameraAndMic(), []);

  return {
    startCameraAndMic,
    startRecording,
    stopRecording,
    getRecording,
    deleteRecording,
    stopCameraAndMic,
  };
}
