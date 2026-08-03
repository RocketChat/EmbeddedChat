import 'normalize.css';

// ─── React 19 logComponentRender patch ───────────────────────────────────────
// React 19's dev-mode calls performance.measure() with a `detail` option that
// contains component prop diffs. The browser internally structured-clones that
// detail, and crashes with:
//   "DOMException: unsupported type for structured data"
// when the EmbeddedChatApi context value (which holds WebSocket/Promises) is
// diffed as a prop on the Context.Provider component.
//
// We can't configure this away — it's baked into react-dom-client.development.js.
// The patch below wraps performance.measure so the DOMException is caught and
// the call is retried without the non-serializable detail, keeping the browser's
// performance timeline intact for everything else.
if (typeof performance !== 'undefined' && typeof performance.measure === 'function') {
  const _originalMeasure = performance.measure.bind(performance);
  performance.measure = function patchedMeasure(name, startOrOptions, endMark) {
    try {
      if (typeof startOrOptions === 'object' && startOrOptions !== null) {
        return _originalMeasure(name, startOrOptions, endMark);
      }
      return _originalMeasure(name, startOrOptions, endMark);
    } catch (e) {
      if (e instanceof DOMException) {
        // Retry without the detail so the mark still appears in DevTools
        try {
          const safe = { ...startOrOptions };
          delete safe.detail;
          return _originalMeasure(name, safe);
        } catch (_) { /* ignore */ }
      } else {
        throw e;
      }
    }
  };
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    // IMPORTANT: Do NOT re-enable argTypesRegex here.
    // Storybook's action addon auto-wraps any on* prop matching the regex and
    // tries to structured-clone every argument via postMessage. File/Blob objects
    // are not cloneable and would cause the same DOMException.
    actions: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

