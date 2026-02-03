# Proposal: Cleaning up ChatInput logic (Moving away from string manipulation)

## 👋 Summary

I've been digging into `ChatInput.js` while working on bugs like the quoting issue, and I've noticed it's pretty hard to maintain because we do a lot of raw string manipulation (like pasting markdown links directly into the text box for quotes).

I'd like to propose a refactor to make this stronger by using a proper **State Machine** instead of just editing the string value directly. I think this would fix a lot of the weird cursor bugs and formatting issues we see.

## 🐛 The Current Problem

Right now, `ChatInput.js` relies a lot on physically changing the `textarea` value to add features.

**Example 1: How we handle Quotes**
When you quote someone, we basically just paste a hidden markdown link `[ ](url)` into the start of the message.

```javascript
// Current code roughly
const quoteLinks = await Promise.all(quoteMessage.map(...));
quotedMessages = quoteLinks.join('');
// Then we just mash it together with the message
pendingMessage = createPendingMessage(`${quotedMessages}\n${message}`);
```

_Why this is tricky:_ If I try to edit my message later, that quote is just text. If I accidentally delete a character, the whole link breaks. Also, stacking multiple quotes gets messy.

**Example 2: Formatting**
When we add bold/italics, we manually calculate `selectionStart` and slice strings. It works, but it's fragile if the user has other formatting nearby.

## 💡 My Idea: Use a "State" instead of just a String

Instead of just tracking the text, maybe we can track the "Input State" as an object?

Something like this:

```javascript
{
  text: "User's message here",
  cursorPosition: 12,
  // Keep quotes separate from the text!
  quotes: [
    { id: "msg_123", author: "UserA" }
  ],
  isEditingId: null
}
```

### How it would work

We could make a reducer (or just a hook) to handle actions safely:

1.  **ADD_QUOTE**: Adds the quote to the `quotes` array. (Doesn't touch the text box!)
2.  **SET_TEXT**: Updates the text safely.
3.  **SEND_MESSAGE**: When the user hits send, _then_ we combine the quotes + text into the final markdown string the server expects.

## 🎯 Benefits

- **Less Buggy:** We won't accidentally break URLs when typing.
- **Better UI:** We could show quotes as little "chips" above the input box (like Discord/Slack do) instead of invisible text inside it.
- **Easier to add features:** If we want to add Slash commands later, we just add a new property to the state.

## 🙋‍♂️ Next Steps

I'm planning to try and build a small prototype of this `useChatInputState` hook for my GSoC proposal.

Does this sound like a good direction? I'd love to hear if there's a reason we used the string-manipulation approach originally!
