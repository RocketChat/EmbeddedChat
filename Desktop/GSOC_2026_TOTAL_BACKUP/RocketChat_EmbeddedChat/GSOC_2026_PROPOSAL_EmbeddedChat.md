# GSoC 2026 Proposal: Making EmbeddedChat More Reliable

**Contributor:** Vivek Yadav  
**Organization:** Rocket.Chat  
**Project:** EmbeddedChat Reliability & UX Improvements

---

## What I Want to Work On

I want to make EmbeddedChat feel more stable and reliable when people use it on their websites.

Right now, EmbeddedChat is a cool way to add Rocket.Chat to any site, but while contributing to the codebase, I found some issues that make it feel fragile. Things like message input breaking when you quote someone, auth getting stuck, and the UI feeling inconsistent compared to the main Rocket.Chat app.

My goal is to fix these core problems so EmbeddedChat feels solid and dependable in real-world use.

---

## The Problems I've Noticed

### 1. Message Input Feels Fragile

The current `ChatInput.js` uses a lot of string manipulation to handle quotes and edits. This breaks easily when you try to edit a quoted message or use formatting.

I already ran into this while fixing the quote duplication bug in PR #1100. The way quotes are inserted right now is basically just pasting text into the input field, which doesn't hold up well.

### 2. Auth Gets Stuck Sometimes

The `useRCAuth` hook manages login using simple true/false flags. It doesn't really handle token expiration, reconnects, or network issues properly.

I've seen cases where users get stuck on "Connecting..." and there's no clear way to recover without refreshing the page.

### 3. UX Feels Less Polished

Compared to the main Rocket.Chat client, EmbeddedChat has some rough edges. Loading states aren't always clear, spacing is inconsistent, and sometimes the UI jumps around when messages load.

Since EmbeddedChat runs on other people's websites, these issues can make the host site look bad, not just Rocket.Chat.

---

## Why This Matters

EmbeddedChat is often the first impression people get of Rocket.Chat when it's embedded in another product. If it feels buggy or unreliable, that reflects poorly on everyone.

By improving stability and UX, this project can:

- Make EmbeddedChat more reliable in production
- Reduce friction for developers integrating it
- Help Rocket.Chat adoption in embedded scenarios

I want to focus on making EmbeddedChat feel solid, not just adding more features.

---

## What I Plan to Do

### 1. Refactor Chat Input

Instead of using string manipulation for quotes and edits, I'll refactor `ChatInput.js` to use structured state.

**Current approach:**

```javascript
setInputText(`[ ](${msg.url}) ${msg.msg}`);
```

This breaks when messages have formatting or get edited.

**Better approach:**

```typescript
interface InputState {
  text: string;
  attachments: Attachment[];
  quoting: {
    messageId: string;
    author: string;
    contentSnippet: string;
  } | null;
}
```

This keeps quote data separate and stable, even when the user edits their message.

### 2. Improve Authentication Flow

Instead of boolean flags, I'll treat auth as a proper state machine:

```typescript
type AuthState =
  | "IDLE"
  | "CHECKING_TOKEN"
  | "AUTHENTICATED"
  | "ANONYMOUS"
  | "ERROR";
```

This makes reconnect logic clearer and easier to maintain. It also makes it easier to show the right UI for each state.

### 3. UX & Polish

I also want to:

- Fix message quoting behavior
- Improve reaction and attachment handling
- Add better loading states and feedback
- Reduce UI jitter and scrolling issues
- Make the overall experience feel closer to the main Rocket.Chat client

---

## How EmbeddedChat Works (Architecture)

![EmbeddedChat Architecture](C:/Users/KIIT/.gemini/antigravity/brain/392d2d58-2da7-4ebe-819d-cef54bf7a726/uploaded_media_1769703811840.png)

The diagram shows how EmbeddedChat connects to Rocket.Chat:

- **Auth Flow:** Uses `useRCAuth` hook to manage login state
- **Input Flow:** `ChatInput` state machine handles message composition
- **State Management:** Zustand store manages local state
- **Real-time Stream:** DDP/REST connects to Rocket.Chat server

My work will focus on strengthening the Auth and Input components to make the whole system more reliable.

---

## Timeline (12 Weeks)

### Community Bonding (May 1 – May 26)

- Study Rocket.Chat SDK internals
- Review existing EmbeddedChat issues
- Identify specific areas needing fixes
- Set up testing environment

### Phase 1: Input System (May 27 – June 30)

- Refactor ChatInput logic to use structured state
- Implement improved quoting behavior
- Add tests for edge cases
- Fix formatting issues

### Phase 2: Auth & Stability (July 1 – July 28)

- Improve token resume and reconnect flow
- Add better error handling
- Improve loading and feedback UI
- Handle network interruptions gracefully

### Phase 3: UX Polish (July 29 – August 25)

- Accessibility improvements
- UI polish and consistency
- Documentation and migration guide
- Demo playground showcasing improvements

---

## What I've Already Done

I've been contributing to EmbeddedChat and exploring the codebase for a few weeks now.

### PR #1100 — Quote Logic Fix

Fixed an issue where quoting messages would duplicate URLs and break formatting. This helped me understand how fragile the current input system is.

### PR #1108 — Stability & Performance

Made 17 improvements including:

- Removed memory leaks in TypingUsers and Media Recorder components
- Optimized message rendering and permission checks
- Improved scrolling behavior
- Fixed emoji parsing issues

### Auth Error Flow Improvements

Improved how login and connection errors are shown to users. Made error feedback clearer and more actionable.

---

## Why I'm Interested

I like working on real-world bugs and stability issues, not just surface-level features.

I've already set up the dev environment, contributed working fixes, and learned how EmbeddedChat behaves in real usage. This project feels like a natural continuation of what I'm already doing.

My goal is simple: make EmbeddedChat more reliable, easier to maintain, and nicer to use.

---

## Other Contributions

I've also been contributing to CircuitVerse:

- **PR #55** — Contribution Streak Feature
- **PR #5442** — CAPTCHA spacing fix
- **PR #6438** — Notification Badge UI update

---

## Links

- **Prototype Repo:** https://github.com/vivekyadav-3/EmbeddedChat-Prototype
- **EmbeddedChat Repo:** https://github.com/RocketChat/EmbeddedChat
- **My GitHub:** https://github.com/vivekyadav-3

---

**I'm excited to work on making EmbeddedChat more reliable and polished. Looking forward to discussing this further!**
