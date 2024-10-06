import { useState, useRef, useEffect } from 'react';

function useUserMedia(constraints, videoRef) {
  const [stream, setStream] = useState(null);

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
  const [recorder, setRecorder] = useState(null);
  const { stream, getStream } = useUserMedia(constraints, videoRef);
  const chunks = useRef([]);

  useEffect(() => {
    async function initializeRecorder() {
      if (!stream) return;

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

    initializeRecorder();

    return () => {
      if (recorder) {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [constraints, onStop, recorder, stream, videoRef]);

  async function start() {
    await getStream(true);
  }

  async function stop() {
    if (recorder) {
      recorder.stop();
      (await getStream()).getTracks().forEach((track) => track.stop());
    }
  }

  return [start, stop];
}
