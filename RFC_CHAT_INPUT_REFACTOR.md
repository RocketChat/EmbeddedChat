# RFC: ChatInput Modernization — State Machine Architecture

**Status:** ✅ Implemented & Merged (GSoC Proposal Work)
**Author:** KIIT | EmbeddedChat GSoC 2026 Candidate

---

## 👋 Summary

After investigating bugs in `ChatInput.js` (particularly around quoting and formatting), I discovered that
the root cause was an over-reliance on raw **string manipulation** of the textarea value to represent
complex logical state (quotes, formatting, editing mode).

This RFC documents the **completed refactor** that replaces this pattern with a structured
**State Machine** approach using React's `useReducer`, along with new clean-separation hooks.

---

## 🐛 The Problem We Solved

### Before: Raw String Manipulation
When you quoted someone, we'd paste a hidden markdown link directly **into the textarea**:

```javascript
// OLD: Quote as invisible text in the textarea
const quoteLinks = quoteMessage.map(quote => `[ ](${host}/channel/${name}/?msg=${quote._id})`);
pendingMessage = `${quoteLinks.join('')}\n${message}`;
```

**Issues with this approach:**
1. **Fragile quotes** — Typing near the invisible link could corrupt the URL, breaking the quote silently.
2. **Terrible UX** — Users couldn't *see* what they were quoting. There was no visual feedback.
3. **Untestable** — The logic was buried inside the component, making it impossible to unit test.
4. **Formatting bugs** — Bold/italic was also done by directly splicing strings, causing cursor drift.

---

## 💡 The Solution: A Three-Layer Architecture

We decoupled the chat input into three cleanly separated concerns:

```
┌────────────────────────────┐
│       ChatInput.js         │  ← UI Only: Layout, events, rendering
└──────────┬─────────────────┘
           │ uses           │ uses
           ▼                ▼
┌─────────────────┐  ┌──────────────────┐
│ useChatInputState│  │  useSendMessage  │
│  (Composition)  │  │   (Side Effects) │
└───────┬─────────┘  └──────────────────┘
        │ dispatches to
        ▼
┌─────────────────────┐
│  ChatInputReducer   │  ← Pure State Machine (unit-testable)
└─────────────────────┘
```

---

## 📦 New Files Created

### 1. `ChatInputReducer.js` — The State Machine Core

A **pure function** with no side effects. All input state transitions run through here.

```javascript
// Action types are now an enum-like const (no magic strings)
export const ACTION_TYPES = {
  SET_TEXT: 'SET_TEXT',
  INSERT_TEXT: 'INSERT_TEXT',
  FORMAT_SELECTION: 'FORMAT_SELECTION',  // Handles bold, italic, etc.
  SET_EDIT_MESSAGE: 'SET_EDIT_MESSAGE',  // Populates input when editing
  CLEAR_INPUT: 'CLEAR_INPUT',
};
```

**Key benefit:** The toggle behavior for formatting (wrap/unwrap bold, italic) lives **here**, not in
the component. It can be unit-tested with a simple `assert(chatInputReducer(state, action).text === ...)`.

### 2. `useChatInputState.js` — The Composition Hook

Connects the reducer to the DOM (the actual `<textarea>`) and to the Zustand message store.
Exposes a clean, stable API to ChatInput:

| Method | Description |
|---|---|
| `text` | The current text value |
| `setText(str)` | Sets text and syncs the DOM ref |
| `insertText(str)` | Inserts at current cursor position |
| `formatSelection(pattern)` | Applies markdown (with toggle support) |
| `getFinalMarkdown()` | Assembles the final message + quote links |
| `quotes` | The list of active quote objects |
| `removeQuote(msg)` | Removes a single quote |
| `clearQuotes()` | Clears all quotes after send |
| `editMessage` | The message currently being edited |
| `setEditMessage(msg)` | Sets the edit target (also populates text) |

### 3. `useSendMessage.js` — Side-Effect Orchestrator

Extracts all async send logic from `ChatInput.js`, including error handling and optimistic updates.

| Method | Description |
|---|---|
| `sendNewMessage(userInfo)` | Gets final markdown, creates pending msg, calls API |
| `sendEditedMessage(id, text)` | Updates a message via API |
| `sendCommand(message)` | Executes a `/slash-command` |
| `sendAsAttachment(text)` | Converts long messages to a `.txt` file upload |

### 4. `QuoteChip.js` — Modern Quote UI

A compact, dismissible chip that appears *above* the input box, replacing the old invisible-link pattern.
Inspired by Slack/Discord's industry-standard UX.

---

## 🎯 How Quote State Now Works

The `quotes` are managed entirely in the existing **Zustand `messageStore`** via `quoteMessage`.
The UI render and the final markdown generation are now separate steps:

**During composition:**
> User clicks "Quote" → `messageStore.quoteMessage` gets the message object → `QuoteChip` renders above the input.

**During send:**
> `getFinalMarkdown()` reads `quoteMessage`, generates the `[ ](url)` links, prepends them to `text`,  
> then `clearQuotes()` is called **only after a successful API response**.

This means if the send fails, the quotes are **preserved** — a bug that existed in the old design.

---

## ✅ Benefits Delivered

| Concern | Before | After |
|---|---|---|
| Quote UI | Invisible text in textarea | Visual "chips" above input |
| Quotes on failed send | Cleared even on failure | Cleared only on success |
| State management | Raw `useState` per field | `useReducer` state machine |
| Send logic location | Inside `ChatInput.js` | `useSendMessage` hook |
| Formatting (bold/italic) | String splice in component | Reducer with toggle support |
| Unit testability | Near zero | Fully testable reducer |
| `ChatInput.js` size | ~676 lines | ~590 lines (and shrinking) |

---

## 🚀 Proposed Next Steps (GSoC Project Scope)

1.  **Attachment State Unification** — Bring file/media attachment state into the reducer so the "Send" flow is fully unified across text, quotes, and files.
2.  ✅ **Slash Command Suggestions UI** — `CommandsList` enhanced with keyboard-first navigation:
    - Listener moved from `document` → `messageRef` textarea (no global pollution)
    - `Tab` key confirms selection (terminal-style UX)
    - `Escape` dismisses the list
    - Trailing space auto-inserted after command (ready for params)
    - Mouse hover syncs the arrow-key selection index
    - ARIA `role="listbox"` / `role="option"` / `aria-selected` for accessibility
    - CSS-class-based active state with left-border indicator (no more inline styles)
3.  **`useDraftMessage`** — Persist the current draft (text + quotes) to `localStorage` so users don't lose their message on accidental close/refresh.

---

*This refactor was completed as part of the GSoC 2026 application to demonstrate technical depth
and alignment with EmbeddedChat's roadmap goals.*
