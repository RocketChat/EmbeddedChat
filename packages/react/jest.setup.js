import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

// jsdom does not expose these globals, which react-dom/server needs.
// MessageChannel is stubbed because Node's real one keeps Jest open.
class MessageChannelStub {
  constructor() {
    this.port1 = { onmessage: null, postMessage: () => {}, close: () => {} };
    this.port2 = {
      postMessage: (data) =>
        setTimeout(() => this.port1.onmessage?.({ data }), 0),
      close: () => {},
    };
  }
}

Object.assign(global, {
  TextEncoder,
  TextDecoder,
  MessageChannel: MessageChannelStub,
});

expect.extend(toHaveNoViolations);
