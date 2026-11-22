import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createGeneratedUiConfiguration } from '@embeddedchat/ui-kit';

const DEV_MODE_STORAGE_KEY = 'ec_generated_ui_dev_mode';

export const useGeneratedUiExport = ({
  componentId,
  componentTitle,
  draftBlocks,
  surface,
  draftComponentType,
  placements,
  dispatchToastMessage,
}) => {
  const [isDevMode, setIsDevMode] = useState(() => {
    try {
      return localStorage.getItem(DEV_MODE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isSyncingPreview, setIsSyncingPreview] = useState(false);
  const syncController = useRef(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      syncController.current?.abort();
    };
  }, []);
  const result = useMemo(() => {
    try {
      return {
        configuration: createGeneratedUiConfiguration({
          id: componentId.trim(),
          title: componentTitle.trim(),
          blocks: draftBlocks,
          surface,
          componentType: draftComponentType,
          placements,
        }),
        error: null,
      };
    } catch (error) {
      return { configuration: null, error: error.message };
    }
  }, [
    componentId,
    componentTitle,
    draftBlocks,
    surface,
    draftComponentType,
    placements,
  ]);

  const getGeneratedUiConfiguration = useCallback(() => {
    if (result.error) throw new Error(result.error);
    return result.configuration;
  }, [result]);
  const reportError = useCallback(
    (error) =>
      dispatchToastMessage({
        type: 'error',
        message: error.message || 'Unable to export this configuration.',
      }),
    [dispatchToastMessage]
  );

  const handleCopyGeneratedUiConfiguration = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(getGeneratedUiConfiguration(), null, 2)
      );
      dispatchToastMessage({
        type: 'success',
        message: 'EmbeddedChat configuration copied to clipboard.',
      });
    } catch (error) {
      reportError(error);
    }
  }, [getGeneratedUiConfiguration, dispatchToastMessage, reportError]);

  const handleDownloadGeneratedUiConfiguration = useCallback(() => {
    try {
      const configuration = getGeneratedUiConfiguration();
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(configuration, null, 2)], {
          type: 'application/json',
        })
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `${configuration.id.replace(
        /[^a-zA-Z0-9_-]/g,
        '-'
      )}.json`;
      document.body.appendChild(link);
      try {
        link.click();
      } finally {
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
      }
      dispatchToastMessage({
        type: 'success',
        message: 'EmbeddedChat configuration downloaded.',
      });
    } catch (error) {
      reportError(error);
    }
  }, [getGeneratedUiConfiguration, dispatchToastMessage, reportError]);

  const handleSyncToEmbeddedChat = useCallback(async () => {
    if (!import.meta.env.DEV || !isDevMode || syncController.current) return;
    const controller = new AbortController();
    syncController.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setIsSyncingPreview(true);
    try {
      const response = await fetch('/__generated-ui-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getGeneratedUiConfiguration()),
        signal: controller.signal,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'The preview sync request failed.');
      }
      if (!mounted.current) return;
      dispatchToastMessage({
        type: 'success',
        message: 'EmbeddedChat preview synced.',
      });
    } catch (error) {
      if (!mounted.current) return;
      reportError(
        error.name === 'AbortError'
          ? new Error(
              'Preview sync was interrupted or timed out. Check the local server and retry.'
            )
          : error
      );
    } finally {
      clearTimeout(timeout);
      syncController.current = null;
      if (mounted.current) setIsSyncingPreview(false);
    }
  }, [
    isDevMode,
    getGeneratedUiConfiguration,
    dispatchToastMessage,
    reportError,
  ]);

  const toggleDevMode = useCallback(() => {
    const next = !isDevMode;
    try {
      localStorage.setItem(DEV_MODE_STORAGE_KEY, String(next));
    } catch {
      /* The toggle still works without storage. */
    }
    setIsDevMode(next);
  }, [isDevMode]);
  return {
    configuration: result.configuration,
    exportError: result.error,
    getGeneratedUiConfiguration,
    isDevMode,
    toggleDevMode,
    isSyncingPreview,
    handleSyncToEmbeddedChat,
    handleCopyGeneratedUiConfiguration,
    handleDownloadGeneratedUiConfiguration,
  };
};
