# EmbeddedChat - Issues Database Export

**Generated:** April 5, 2026 14:33 UTC  
**Source:** Session SQL Database (in-memory SQLite)  
**Total Issues:** 17 tracked  
**Status:** All NEW (not in GitHub)

---

## 📊 Summary by Severity

| Severity | Total | New | Issue Types |
|----------|-------|-----|-------------|
| **HIGH** | 2 | 2 | testing |
| **MEDIUM** | 9 | 9 | testing, documentation, code-quality |
| **LOW** | 6 | 6 | documentation, code-quality |

---

## 🔴 HIGH SEVERITY ISSUES (2)

### Issue #001 - Testing Gap: API Package
**Type:** Testing  
**Severity:** HIGH  
**Location:** `packages/api`  
**Status:** NEW

**Description:**  
0 test files found - Critical package with no tests

**Suggested Fix:**  
Add unit tests for EmbeddedChatApi methods, especially message sending and event handling

**Created:** 2026-04-05 13:45:04

---

### Issue #002 - Testing Gap: Auth Package
**Type:** Testing  
**Severity:** HIGH  
**Location:** `packages/auth`  
**Status:** NEW

**Description:**  
0 test files found - Authentication package with no tests

**Suggested Fix:**  
Add tests for OAuth flow, token handling, and secure login

**Created:** 2026-04-05 13:45:04

---

## 🟡 MEDIUM SEVERITY ISSUES (9)

### Issue #003 - Testing Gap: HTMLEmbed Package
**Type:** Testing  
**Severity:** MEDIUM  
**Location:** `packages/htmlembed`  
**Status:** NEW

**Description:**  
0 test files found

**Suggested Fix:**  
Add integration tests for HTML embedding functionality

**Created:** 2026-04-05 13:45:04

---

### Issue #004 - Testing Gap: Markups Package
**Type:** Testing  
**Severity:** MEDIUM  
**Location:** `packages/markups`  
**Status:** NEW

**Description:**  
0 test files found

**Suggested Fix:**  
Add tests for markup parsing and rendering

**Created:** 2026-04-05 13:45:04

---

### Issue #005 - Testing Gap: UI Kit Package
**Type:** Testing  
**Severity:** MEDIUM  
**Location:** `packages/ui-kit`  
**Status:** NEW

**Description:**  
0 test files found

**Suggested Fix:**  
Add component tests for UI kit components

**Created:** 2026-04-05 13:45:04

---

### Issue #006 - Testing Gap: UI Elements Package
**Type:** Testing  
**Severity:** MEDIUM  
**Location:** `packages/ui-elements`  
**Status:** NEW

**Description:**  
0 test files found

**Suggested Fix:**  
Add tests for UI elements (Icon, Sidebar, Popup, etc.)

**Created:** 2026-04-05 13:45:04

---

### Issue #007 - Documentation: Missing API README
**Type:** Documentation  
**Severity:** MEDIUM  
**Location:** `packages/api`  
**Status:** NEW

**Description:**  
Missing README file

**Suggested Fix:**  
Create README.md with API usage examples and documentation

**Created:** 2026-04-05 13:45:04

---

### Issue #008 - Documentation: Missing Auth README
**Type:** Documentation  
**Severity:** MEDIUM  
**Location:** `packages/auth`  
**Status:** NEW

**Description:**  
Missing README file

**Suggested Fix:**  
Create README.md documenting authentication flows

**Created:** 2026-04-05 13:45:04

---

### Issue #009 - Documentation: Missing HTMLEmbed README
**Type:** Documentation  
**Severity:** MEDIUM  
**Location:** `packages/htmlembed`  
**Status:** NEW

**Description:**  
Missing README file

**Suggested Fix:**  
Create README.md for HTML embedding guide

**Created:** 2026-04-05 13:45:04

---

### Issue #012 - Code Quality: Console Statements in API
**Type:** Code Quality  
**Severity:** MEDIUM  
**Location:** `packages/api/src/EmbeddedChatApi.ts`  
**Status:** NEW

**Description:**  
40 console.log/error/warn statements - Production code quality issue

**Suggested Fix:**  
Replace console logs with proper logging library or remove debug statements

**Created:** 2026-04-05 13:45:04

---

### Issue #014 - Code Quality: Thread Events Not Implemented
**Type:** Code Quality  
**Severity:** MEDIUM  
**Location:** `packages/api/src/EmbeddedChatApi.ts`  
**Status:** NEW

**Description:**  
TODO: Thread message event listeners not implemented

**Suggested Fix:**  
Implement thread message event handling after thread feature is complete

**Created:** 2026-04-05 13:45:04

---

## 🔵 LOW SEVERITY ISSUES (6)

### Issue #010 - Documentation: Missing Markups README
**Type:** Documentation  
**Severity:** LOW  
**Location:** `packages/markups`  
**Status:** NEW

**Description:**  
Missing README file

**Suggested Fix:**  
Create README.md for markup syntax documentation

**Created:** 2026-04-05 13:45:04

---

### Issue #011 - Documentation: Missing UI Kit README
**Type:** Documentation  
**Severity:** LOW  
**Location:** `packages/ui-kit`  
**Status:** NEW

**Description:**  
Missing README file

**Suggested Fix:**  
Create README.md for UI kit component library

**Created:** 2026-04-05 13:45:04

---

### Issue #013 - Code Quality: Console Statements Widespread
**Type:** Code Quality  
**Severity:** LOW  
**Location:** `Multiple files across packages`  
**Status:** NEW

**Description:**  
32+ console.log statements in production code

**Suggested Fix:**  
Implement proper logging strategy with configurable levels

**Created:** 2026-04-05 13:45:04

---

### Issue #015 - Code Quality: Custom Emoji Support Missing
**Type:** Code Quality  
**Severity:** LOW  
**Location:** `packages/react-native`  
**Status:** NEW

**Description:**  
TODO: Custom emoji support missing

**Suggested Fix:**  
Add custom emoji support to Markup/Emoji component

**Created:** 2026-04-05 13:45:04

---

### Issue #016 - Code Quality: Slash Commands Not Implemented
**Type:** Code Quality  
**Severity:** LOW  
**Location:** `packages/react-native`  
**Status:** NEW

**Description:**  
TODO: Slash command handling not implemented

**Suggested Fix:**  
Implement slash command parsing and execution in ChatInput

**Created:** 2026-04-05 13:45:04

---

### Issue #017 - Code Quality: Attachments Rendering Incomplete
**Type:** Code Quality  
**Severity:** LOW  
**Location:** `packages/react-native`  
**Status:** NEW

**Description:**  
TODO: Attachments rendering commented out

**Suggested Fix:**  
Complete attachment rendering implementation in MessageBody

**Created:** 2026-04-05 13:45:04

---

## 📋 Issue Categories

### Testing Gaps (6 issues)
- **HIGH:** API, Auth packages have no tests
- **MEDIUM:** HTMLEmbed, Markups, UI Kit, UI Elements have no tests
- **Impact:** Critical authentication and API code is untested

### Documentation Gaps (5 issues)
- **MEDIUM:** API, Auth, HTMLEmbed missing READMEs
- **LOW:** Markups, UI Kit missing READMEs
- **Impact:** Poor developer experience, difficult onboarding

### Code Quality (6 issues)
- **MEDIUM:** 40 console statements in API, Thread events not implemented
- **LOW:** 32+ console statements widespread, TODOs for emoji/slash/attachments
- **Impact:** Production debugging overhead, incomplete features

---

## 🎯 Recommended Actions

### Phase 1: High Priority Testing (Week 1-2)
1. **Issue #001** - Add API tests (message send/receive, event handlers)
2. **Issue #002** - Add Auth tests (OAuth, token management, login flows)

### Phase 2: Documentation (Week 3)
3. **Issue #007** - Create API README with usage examples
4. **Issue #008** - Create Auth README with flow diagrams

### Phase 3: Code Quality (Week 4)
5. **Issue #012** - Replace console statements with logging library
6. **Issue #014** - Complete thread message event listeners

### Phase 4: Remaining Issues (Backlog)
7. Add tests for remaining packages (#003-006)
8. Create remaining READMEs (#009-011)
9. Implement missing features (#015-017)
10. Implement logging strategy (#013)

---

## 📝 Notes

- **Database Type:** Session-based in-memory SQLite
- **Not Exported:** 16 additional critical/high issues were identified in the comprehensive analysis but not yet added to SQL database
- **GitHub Status:** None of these 17 issues exist in the GitHub repository (78 existing issues reviewed)
- **All Status:** NEW - No issues have been addressed yet

---

## 🔍 Additional Critical Issues Found (Not in SQL)

During comprehensive codebase analysis, the following critical issues were discovered but not yet added to the SQL database:

### Security Issues
- **Password Storage:** Plain-text passwords in Zustand store (CRITICAL)
- **Error Handling:** Silent promise failures in authentication (CRITICAL)

### Architecture Issues  
- **Missing Error Boundaries:** No React error boundaries (HIGH)
- **React Version Mismatch:** v17 vs v18 fragmentation (HIGH)
- **Type Safety:** 30+ instances of `any` type (CRITICAL)

### Performance Issues
- **Memory Leaks:** useEffect hooks without cleanup (MEDIUM)
- **Bundle Size:** Circular dependencies enabled (MEDIUM)

**Recommendation:** These critical issues should be added to the database and prioritized above the current 17 tracked issues.

---

**Database Last Updated:** 2026-04-05 13:45:04  
**Export Date:** 2026-04-05 14:33:14  
**Total Tracked Issues:** 17  
**Awaiting Addition:** 16 critical/high issues from comprehensive analysis
