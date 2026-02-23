# Pull Request Summary

## 🎯 Issues Addressed

### Issue #1149: Search API does not URL-encode searchText query parameter

**Status:** ✅ Fixed

**Problem:**
The search API request did not URL-encode user-provided `searchText` before appending it to query params. Special characters like `&`, `?`, `#`, `%` could break or alter query parsing.

**Solution:**

- Added `encodeURIComponent(text)` to properly encode user input in `packages/api/src/EmbeddedChatApi.ts` (line 1114)
- Ensures all user input is treated as data, not query syntax
- Prevents query parameter corruption

**Files Changed:**

- `packages/api/src/EmbeddedChatApi.ts`

**Commit:** `aaeb3c2a` - fix: URL-encode searchText parameter in getSearchMessages API

---

## ⚡ Performance Improvement

### Typing Indicator Timeout Optimization

**Status:** ✅ Implemented

**Change:**

- Reduced typing indicator timeout from 15 seconds to 10 seconds
- Makes the "typing..." status more responsive
- Improves real-time chat experience

**Files Changed:**

- `packages/react/src/views/ChatInput/ChatInput.js` (line 264)

**Commit:** `233457d0` - perf: reduce typing indicator timeout from 15s to 10s

---

## 📝 Testing

### Manual Testing Steps for Issue #1149:

1. Open chat and use Search Messages
2. Enter a query containing special characters: `hello&room?x#tag%`
3. Trigger search and verify:
   - Search executes successfully
   - Special characters are properly encoded in the URL
   - Search results are correct

### Manual Testing Steps for Typing Indicator:

1. Open chat
2. Start typing a message
3. Stop typing
4. Verify typing indicator disappears after 10 seconds (previously 15 seconds)

---

## 🔗 Related Issues

- Fixes #1149

---

## 📊 Impact

- **Security:** Prevents potential query injection through special characters
- **UX:** Faster typing indicator updates improve perceived responsiveness
- **Correctness:** Search now works correctly with all user input

---

## ✅ Checklist

- [x] Code follows project style guidelines
- [x] Changes are backward compatible
- [x] Commits follow conventional commit format
- [x] No breaking changes introduced
- [x] Ready for review
