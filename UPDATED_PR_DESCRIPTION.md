# Updated PR Description for #1135

This PR focuses on improving overall stability, API reliability, and developer experience. It includes critical bug fixes, performance improvements, and code quality enhancements.

---

## 🐛 Bug Fixes

### Fixes #1149 - Search with special characters now works properly

Hey! I noticed that searching for messages with special characters like `&`, `?`, `#`, or `%` was breaking the search functionality. The issue was that we weren't encoding the search text before sending it to the API, so these characters were messing up the URL query parameters.

I've fixed this by properly encoding the user input before it gets added to the search request. Now you can search for anything without worrying about special characters breaking things.

**How to test:**

- Try searching for something like `hello&world?test#tag%`
- The search should work smoothly without any errors
- Results should match what you're actually looking for

### Fixed critical ReferenceError in authentication flow

Fixed a runtime crash caused by a notification dispatcher being called before it was defined. This prevents the app from crashing during authentication failures.

---

## ⚡ Performance Improvements

### Typing indicator optimization

While I was at it, I noticed the typing indicator was taking 15 seconds to disappear after someone stopped typing. That felt a bit slow, so I reduced it to 10 seconds. It's a small change but makes the chat feel more responsive and real-time.

---

## 🔧 Code Quality Improvements

### API reliability enhancements

Replaced manual string-based request building with proper JSON serialization. This makes data transfer more reliable, avoids syntax issues, and safely handles special characters in messages.

### Type safety improvements

Added missing property validation for core UI components, helping catch errors earlier and making component usage clearer.

### Logic optimization

Cleaned up internal hooks and resolved dependency warnings for more predictable behavior and slightly better performance.

### General cleanup

Fixed typos in docs and comments and made the code style more consistent across the project.

---

## 📊 Impact

**Security & Correctness:**

- The URL encoding fix prevents potential issues where special characters could be interpreted as query syntax instead of search terms
- Makes search more reliable and secure

**Better UX:**

- The faster typing indicator makes conversations feel more natural and responsive
- Users won't see stale "typing..." indicators hanging around for too long
- No more crashes during login failures

**Developer Experience:**

- Better type safety catches errors earlier
- More maintainable and consistent codebase

---

## ✅ Testing

- [x] Verified the project builds successfully without errors
- [x] Confirmed the notification dispatcher works correctly after the fix
- [x] Tested search with various special characters
- [x] Verified typing indicator timeout works as expected
- [x] Ensured all changes pass linting and code style checks
- [x] No breaking changes
- [x] Follows existing code style
- [x] Ready for review!
