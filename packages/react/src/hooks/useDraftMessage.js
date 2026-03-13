import { useEffect, useRef } from 'react';

/**
 * useDraftMessage — Persists composer state to localStorage.
 * 
 * This ensures that if the user refreshes or crashes, their unsent message,
 * quotes, and composer context are restored automatically.
 * 
 * @param {string} roomId - The current room ID.
 * @param {string} text - Current message text.
 * @param {Array} quotes - List of quoted messages.
 * @param {Object} actions - { setText, setQuoteMessages }
 */
export const useDraftMessage = (roomId, text, quotes, { setText, setQuoteMessages }) => {
  const isLoaded = useRef(false);
  const prevRoomId = useRef(roomId);

  // Load draft on mount or roomId change
  useEffect(() => {
    if (!roomId) return;
    
    // If we switch rooms, we reset the loaded flag so we can load the new room's draft
    if (prevRoomId.current !== roomId) {
      isLoaded.current = false;
      prevRoomId.current = roomId;
    }

    if (isLoaded.current) return;

    const key = `ec_draft_${roomId}`;
    const savedDraft = localStorage.getItem(key);
    
    if (savedDraft) {
      try {
        const { text: savedText, quotes: savedQuotes } = JSON.parse(savedDraft);
        if (savedText) {
          setText(savedText);
        }
        if (savedQuotes && savedQuotes.length > 0) {
          setQuoteMessages(savedQuotes);
        }
      } catch (err) {
        console.error('Failed to parse draft message from localStorage', err);
      }
    }
    isLoaded.current = true;
  }, [roomId, setText, setQuoteMessages]);

  // Save draft whenever state changes, but ONLY after the initial load for that room
  useEffect(() => {
    if (!roomId || !isLoaded.current) return;

    const key = `ec_draft_${roomId}`;

    if (text || (quotes && quotes.length > 0)) {
      const draft = {
        text,
        quotes,
        // Attachments (File objects) cannot be stored in localStorage.
        // In a future update (GSoC 2026), these will be moved to IndexedDB.
        updatedAt: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(draft));
    } else {
      localStorage.removeItem(key);
    }
  }, [roomId, text, quotes]);
};

export default useDraftMessage;
