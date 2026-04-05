# Issue Tracking - Critical Fixes

**Last Updated:** April 5, 2026 14:55 UTC

---

## 🔴 Critical Issues - GitHub Status

| ID | GitHub Issue | Title | Status | Priority | Assignee |
|----|--------------|-------|--------|----------|----------|
| CRITICAL-001 | [#1263](https://github.com/RocketChat/EmbeddedChat/issues/1263) | Password Storage Vulnerability (CWE-312) | 🟡 IN PROGRESS | P0 | @me |
| CRITICAL-002 | [#1264](https://github.com/RocketChat/EmbeddedChat/issues/1264) | Silent Promise Failures in Auth | 🔴 NEW | P0 | @me |
| CRITICAL-003 | [#1265](https://github.com/RocketChat/EmbeddedChat/issues/1265) | Widespread 'any' type usage | 🔴 NEW | P0 | @me |

---

## 📝 Fix Progress

### Issue #1263 - Password Storage Vulnerability
**Status:** 🟡 IN PROGRESS  
**Timeline:** Fix within 24 hours  
**Started:** April 5, 2026 14:55 UTC

**Files to Modify:**
- [ ] `packages/react/src/store/userStore.js` - Remove password field
- [ ] `packages/react-native/src/store/userStore.js` - Remove password field
- [ ] Audit components using password from store
- [ ] Test login flow without password storage
- [ ] Commit and push fix
- [ ] Create Pull Request

**Commits:** None yet

**Pull Requests:** None yet

---

### Issue #1264 - Silent Promise Failures
**Status:** 🔴 NEW  
**Timeline:** Fix within 48 hours  
**Started:** Not started

**Files to Modify:**
- [ ] `packages/api/src/EmbeddedChatApi.ts` (lines 115-118, 145-147)
- [ ] `packages/auth/src/RocketChatAuth.ts` (lines 199-201)
- [ ] Add tests for error scenarios
- [ ] Commit and push fix
- [ ] Create Pull Request

**Commits:** None yet

**Pull Requests:** None yet

---

### Issue #1265 - Type Safety
**Status:** 🔴 NEW  
**Timeline:** Begin immediately, 1-2 weeks for critical paths  
**Started:** Not started

**Files to Modify:**
- [ ] Define core interfaces (MessageData, UserData, etc.)
- [ ] `packages/api/src/EmbeddedChatApi.ts` - Type callbacks
- [ ] `packages/auth/src/RocketChatAuth.ts` - Type currentUser
- [ ] `packages/api/src/cloneArray.ts` - Use generics
- [ ] Phase 2: Remaining packages
- [ ] Commit and push fix
- [ ] Create Pull Request

**Commits:** None yet

**Pull Requests:** None yet

---

## 🚀 Deployment Pipeline

### Branch Strategy
- **Development Branch:** `develop`
- **Feature Branches:** `fix/issue-1263-password-storage`, `fix/issue-1264-silent-errors`, `fix/issue-1265-type-safety`
- **Target Branch:** `develop`

### PR Checklist (Per Issue)
- [ ] All modified files committed
- [ ] Commit message references GitHub issue
- [ ] Tests added/updated
- [ ] Code reviewed
- [ ] PR created with proper description
- [ ] CI/CD checks passing
- [ ] Merged to develop

---

## 📊 Statistics

**Total Critical Issues:** 3  
**Issues Created:** 3  
**Issues In Progress:** 1  
**Issues Completed:** 0  
**Pull Requests:** 0  

**Completion:** 0% (0/3)

---

## 🎯 Current Focus

**NOW:** Fixing Issue #1263 (Password Storage)  
**NEXT:** Issue #1264 (Silent Promise Failures)  
**THEN:** Issue #1265 (Type Safety - Phase 1)

---

**Notes:**
- All issues created on April 5, 2026
- Priority: P0 (Critical)
- Assigned to: Current user
- Repository: RocketChat/EmbeddedChat
