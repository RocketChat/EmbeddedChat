import { useState, useRef } from 'react';

function useUserMedia(constraints) {
  const [stream, setStream] = useState();
  async function getStream(refresh = false) {
    if (stream && !refresh) {
      return stream;
    }
    const _stream = await navigator.mediaDevices.getUserMedia(constraints);
    setStream(_stream);
    return _stream;
  }
  return { stream, getStream };
}

export function useMediaRecorder({ constraints, onStop }) {
  const [recorder, setRecorder] = useState();
  const { getStream } = useUserMedia(constraints);
  const audioChunks = useRef([]);

  async function start() {
    const stream = await getStream(constraints, true);
    audioChunks.current = [];
    const _recorder = new MediaRecorder(stream);
    _recorder.start();
    setRecorder(_recorder);
    _recorder.addEventListener('dataavailable', (event) => {
      audioChunks.current.push(event.data);
    });
    _recorder.addEventListener('stop', () => {
      // setBlob(audioChunks.current);
      onStop && onStop(audioChunks.current);
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
