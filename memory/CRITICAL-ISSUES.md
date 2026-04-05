# 🚨 EmbeddedChat - Critical Issues (URGENT)

**Priority:** IMMEDIATE ACTION REQUIRED  
**Generated:** April 5, 2026  
**Source:** Comprehensive Codebase Analysis

These issues were discovered during deep analysis but are **NOT yet in the SQL database** or GitHub issues. They represent **critical security, architecture, and type safety problems** that need immediate attention.

---

## 🔴 CRITICAL SEVERITY (3 issues)

### CRITICAL-001: Security - Plain-text Password Storage

**Severity:** 🔴 CRITICAL  
**Type:** Security Vulnerability  
**CWE:** CWE-312 (Cleartext Storage of Sensitive Information)

**Affected Files:**
- `packages/react/src/store/userStore.js` (lines 26-27)
- `packages/react-native/src/store/userStore.js` (lines 13-14)

**Vulnerable Code:**
```javascript
// Current vulnerable implementation:
const useUserStore = create((set) => ({
  username: null,
  password: null,  // ❌ CRITICAL: Plain-text password in state
  token: null,
  
  setPassword: (password) => set(() => ({ password })),  // ❌ Stores raw password
}));
```

**Security Impact:**
- ⚠️ Passwords accessible in browser memory
- ⚠️ Visible in React DevTools
- ⚠️ Persisted if store uses persistence middleware
- ⚠️ Exposed in application state dumps
- ⚠️ Violates OWASP Top 10 (A02:2021 - Cryptographic Failures)

**Exploitation Scenario:**
1. User logs in with password
2. Password stored in Zustand store
3. Attacker uses React DevTools or memory inspection
4. Password retrieved in clear text
5. Attacker gains full account access

**Fix (IMMEDIATE):**
```javascript
// Remove password storage entirely:
const useUserStore = create((set) => ({
  username: null,
  token: null,  // Keep only secure token
  // REMOVED: password, setPassword
  
  setToken: (token) => set(() => ({ token })),
}));

// In login flow - never store password:
const handleLogin = async (username, password) => {
  const { token } = await api.login(username, password);
  useUserStore.getState().setToken(token);  // Store token only
  // password is discarded after login
};
```

**Timeline:** Fix within 24 hours

---

### CRITICAL-002: Error Handling - Silent Promise Failures

**Severity:** 🔴 CRITICAL  
**Type:** Error Handling Bug  
**Impact:** Authentication Bypass / Data Loss

**Affected Files:**
- `packages/api/src/EmbeddedChatApi.ts` (lines 115-118, 145-147)
- `packages/auth/src/RocketChatAuth.ts` (lines 199-201)

**Vulnerable Code:**
```javascript
// googleSSOLogin - Error not returned
async googleSSOLogin(token) {
  try {
    const response = await this.auth.googleSSOLogin(token);
    return { status: 'success', me: response };
  } catch (err) {
    console.error(err);  // ❌ Error logged but not returned
  }  // ❌ Function returns undefined
}

// Caller receives undefined instead of error
const result = await api.googleSSOLogin(token);
// result === undefined (not { status: 'error' })
```

**Impact:**
- 🔥 Login failures appear successful
- 🔥 User left in inconsistent state (no auth, but UI shows logged in)
- 🔥 No error feedback to user
- 🔥 Impossible to debug authentication issues

**Additional Occurrences:**
```javascript
// packages/api/src/EmbeddedChatApi.ts:145
async loginWithPassword(user, password) {
  try {
    // ... login logic
  } catch (error) {
    console.error(error);  // ❌ Same issue
  }
}

// packages/auth/src/RocketChatAuth.ts:199
async load() {
  try {
    this.currentUser = await this.api.me();
  } catch (err) {
    console.error('Failed to load user:', err);  // ❌ Same issue
  }
}
```

**Fix (IMMEDIATE):**
```javascript
async googleSSOLogin(token) {
  try {
    const response = await this.auth.googleSSOLogin(token);
    return { status: 'success', me: response };
  } catch (err) {
    console.error(err);
    return { status: 'error', error: err.message };  // ✅ Return error
  }
}

// Better: Use typed result
type LoginResult = 
  | { success: true; data: UserData }
  | { success: false; error: string };

async googleSSOLogin(token): Promise<LoginResult> {
  try {
    const response = await this.auth.googleSSOLogin(token);
    return { success: true, data: response };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
```

**Timeline:** Fix within 48 hours

---

### CRITICAL-003: Type Safety - Widespread `any` Type Usage

**Severity:** 🔴 CRITICAL  
**Type:** Type Safety / Code Quality  
**Impact:** Runtime Errors / Broken Refactoring

**Affected Files (30+ occurrences):**
- `packages/api/src/cloneArray.ts:1`
- `packages/api/src/EmbeddedChatApi.ts:16-20`
- `packages/auth/src/RocketChatAuth.ts:11`
- `packages/auth/src/Api.ts:7, 33-34`
- `packages/rc-app/lib/getCallbackContent.ts:1`
- And 25+ more files

**Problematic Code:**
```typescript
// packages/api/src/cloneArray.ts
const cloneArray = (array: any[]): any[] => [...array];  // ❌ No type safety

// packages/api/src/EmbeddedChatApi.ts
constructor(
  host: string,
  rid: string,
  { getAuth, setAuth }: any,  // ❌ Bypasses all type checking
) {}

onMessage(callback: (message: any) => void) {  // ❌ No message structure
  // ...
}

// packages/auth/src/RocketChatAuth.ts
currentUser: any = null;  // ❌ User shape unknown
```

**Impact:**
- ❌ No IDE autocomplete
- ❌ No type errors caught at compile time
- ❌ Refactoring breaks silently
- ❌ Runtime errors in production
- ❌ Impossible to trace data flow

**Example Runtime Error:**
```javascript
// Caller assumes message has specific fields
onMessage((message: any) => {
  console.log(message.user.name);  // Runtime error if user is undefined
});
```

**Fix (Ongoing - Start with Critical Paths):**
```typescript
// Define proper interfaces
interface MessageData {
  _id: string;
  rid: string;
  msg: string;
  ts: Date;
  u: {
    _id: string;
    username: string;
    name?: string;
  };
  attachments?: Attachment[];
  [key: string]: unknown;  // Allow additional fields
}

// Use proper types
const cloneArray = <T extends Record<string, unknown>>(array: T[]): T[] => {
  return [...array];
};

interface AuthCallbacks {
  getAuth: () => AuthToken | null;
  setAuth: (token: AuthToken) => void;
}

constructor(
  host: string,
  rid: string,
  callbacks: AuthCallbacks,
) {}

onMessage(callback: (message: MessageData) => void) {
  // Now callback has type-safe message
}
```

**Timeline:** Begin immediately, complete critical paths within 1 week

---

## 🟠 HIGH SEVERITY (5 issues)

### HIGH-001: Architecture - Missing Error Boundaries

**Severity:** 🟠 HIGH  
**Type:** React Architecture  
**Location:** `packages/react/src/`

**Problem:**  
No Error Boundary components found in codebase. Single component error crashes entire application.

**Impact:**
- 💥 One component error = entire app white screen
- 💥 No graceful degradation
- 💥 Poor user experience
- 💥 No error tracking/reporting

**Fix:**
```jsx
// Create: packages/react/src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Use in packages/react/src/views/EmbeddedChat.js
import ErrorBoundary from '../components/ErrorBoundary';

const EmbeddedChat = () => (
  <ErrorBoundary>
    <RCContext.Provider>
      <ChatLayout>
        <ErrorBoundary>  {/* Nested for better isolation */}
          <ChatBody />
        </ErrorBoundary>
        <ErrorBoundary>
          <ChatInput />
        </ErrorBoundary>
      </ChatLayout>
    </RCContext.Provider>
  </ErrorBoundary>
);
```

**Timeline:** 1 week

---

### HIGH-002: Dependencies - React Version Fragmentation

**Severity:** 🟠 HIGH  
**Type:** Build/Configuration  
**Location:** Multiple `package.json` files

**Problem:**  
- Core packages: React 17.0.2 (as peer dependencies)
- Consumer packages: React 18.2.0 (as dependencies)

**Affected Packages:**
- React 17: `@embeddedchat/react`, `ui-kit`, `ui-elements`, `markups`
- React 18: `htmlembed`, `layout_editor`, `e2e-react`, `react-native`

**Impact:**
- ⚠️ Peer dependency warnings/errors
- ⚠️ Different React instances (duplicate React)
- ⚠️ Hooks behave differently between versions
- ⚠️ Bundle size increase (2 React versions)

**Fix:**
```json
// All packages should use broad peer dependencies:
// package.json for @embeddedchat/react, ui-kit, markups, etc.
{
  "peerDependencies": {
    "react": ">=17.0.2 <19.0.0",
    "react-dom": ">=17.0.2 <19.0.0"
  }
}

// Remove direct dependencies, use only peer dependencies
// Consumers install their preferred version (17 or 18)
```

**Timeline:** 1 week

---

### HIGH-003: API Design - Inconsistent Error Response Shapes

**Severity:** 🟠 HIGH  
**Type:** API Design / Type Safety  
**Location:** `packages/api/src/EmbeddedChatApi.ts`

**Problem:**  
Different methods return different error shapes - no standard format.

**Examples:**
```javascript
// Success returns:
{ status: 'success', me: userData }

// Error returns (inconsistent):
{ error: 'Invalid credentials' }
{ error: 'totp-required' }
undefined  // (if catch doesn't return)
{ status: 'error', message: 'Network failed' }
```

**Impact:**
- 🔥 Impossible to handle errors consistently
- 🔥 Callers must check multiple fields
- 🔥 TypeScript can't discriminate unions

**Fix:**
```typescript
// Define standard result types
type Success<T> = { success: true; data: T };
type Failure = { 
  success: false; 
  error: { code: string; message: string; details?: unknown }
};
type Result<T> = Success<T> | Failure;

// Use consistently:
async login(username: string, password: string): Promise<Result<UserData>> {
  try {
    const user = await this.auth.login(username, password);
    return { success: true, data: user };
  } catch (err) {
    return { 
      success: false, 
      error: { 
        code: 'LOGIN_FAILED', 
        message: err.message 
      }
    };
  }
}

// Handle with type narrowing:
const result = await api.login(user, pass);
if (result.success) {
  console.log(result.data.username);  // Type-safe!
} else {
  console.error(result.error.message);  // Type-safe!
}
```

**Timeline:** 1-2 weeks

---

### HIGH-004: State Management - No Store Validation

**Severity:** 🟠 HIGH  
**Type:** State Management  
**Location:** `packages/react/src/store/*`

**Problem:**  
Zustand stores accept any value with no validation.

```javascript
const useUserStore = create((set) => ({
  username: null,
  roles: [],
  
  setUsername: (username) => set(() => ({ username })),  // ❌ No validation
  setRoles: (roles) => set(() => ({ roles })),            // ❌ No validation
}));

// Callers can set invalid data:
setUsername(123);        // Should be string
setRoles("not-array");  // Should be array
```

**Impact:**
- 💥 Invalid data propagates through app
- 💥 UI crashes or shows corrupted state
- 💥 Hard to debug data flow

**Fix:**
```javascript
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(1).max(50),
  roles: z.array(z.string()),
});

const useUserStore = create((set) => ({
  username: null,
  roles: [],
  
  setUsername: (username) => {
    const validated = userSchema.shape.username.parse(username);
    set(() => ({ username: validated }));
  },
  
  setRoles: (roles) => {
    const validated = userSchema.shape.roles.parse(roles);
    set(() => ({ roles: validated }));
  },
}));
```

**Timeline:** 1 week

---

### HIGH-005: Code Quality - Production Console Statements

**Severity:** 🟠 HIGH  
**Type:** Code Quality / Production Readiness  
**Location:** 50+ files

**Files with Most Console Statements:**
- `packages/api/src/EmbeddedChatApi.ts` (40 statements)
- `packages/react/src/` (25+ statements)

**Problem:**
- 📉 Performance overhead in production
- 📉 Information disclosure (internal data exposed)
- 📉 Console flooding makes debugging harder

**Fix:**
```javascript
// Create logger: packages/api/src/logger.ts
const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  debug: (...args) => isDev && console.log('[DEBUG]', ...args),
  info: (...args) => isDev && console.info('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};

// Replace console calls:
// import { logger } from './logger';
// logger.debug('Message received:', message);  // No-op in production
```

**Timeline:** 2 weeks

---

## 📋 Summary Table

| ID | Issue | Severity | Type | Timeline |
|----|-------|----------|------|----------|
| CRITICAL-001 | Password in Store | 🔴 CRITICAL | Security | 24 hours |
| CRITICAL-002 | Silent Failures | 🔴 CRITICAL | Error Handling | 48 hours |
| CRITICAL-003 | `any` Types | 🔴 CRITICAL | Type Safety | 1 week |
| HIGH-001 | No Error Boundaries | 🟠 HIGH | Architecture | 1 week |
| HIGH-002 | React Versions | 🟠 HIGH | Dependencies | 1 week |
| HIGH-003 | Error Shapes | 🟠 HIGH | API Design | 1-2 weeks |
| HIGH-004 | No Validation | 🟠 HIGH | State Mgmt | 1 week |
| HIGH-005 | Console Logs | 🟠 HIGH | Code Quality | 2 weeks |

---

## 🚨 IMMEDIATE ACTION PLAN

### Day 1 (TODAY)
1. **CRITICAL-001** - Remove password from store
   - Files: 2 files, 2 lines each
   - Time: 1 hour
   - Risk: None (improves security)

### Day 2
2. **CRITICAL-002** - Fix silent promise failures
   - Files: 3 files, ~10 functions
   - Time: 4 hours
   - Risk: Low (improves error handling)

### Week 1
3. **CRITICAL-003** - Type critical paths
   - Start: EmbeddedChatApi, RocketChatAuth
   - Time: Ongoing (20 hours)
4. **HIGH-001** - Add Error Boundaries
   - Files: 2 new, 3 modified
   - Time: 8 hours

### Week 2
5. **HIGH-002** - Align React versions
   - Files: 12 package.json
   - Time: 4 hours
6. **HIGH-004** - Add store validation
   - Files: 5 store files
   - Time: 6 hours

---

## 📝 Notes

- **All 8 issues are NEW** - Not in GitHub or SQL database
- **Security impact:** CRITICAL-001 is the highest risk
- **Type safety:** CRITICAL-003 will take multiple sprints to fully resolve
- **Quick wins:** CRITICAL-001, HIGH-001 can be fixed quickly

**Status:** AWAITING TRIAGE  
**Recommended:** Add these to SQL database and GitHub issues ASAP
