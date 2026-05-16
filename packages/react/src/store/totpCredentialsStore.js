import { create } from 'zustand';

// SECURITY FIX (Issue #1263): Temporary TOTP credentials store
// This store holds credentials ONLY during the TOTP flow (seconds)
// and is cleared immediately after authentication completes or fails.
// Unlike the global userStore, this is intentionally ephemeral.

const useTotpCredentialsStore = create((set) => ({
  tempEmailOrUser: null,
  tempPassword: null,
  
  // Store credentials temporarily during TOTP flow
  setTotpCredentials: (emailOrUser, password) => 
    set({ tempEmailOrUser: emailOrUser, tempPassword: password }),
  
  // Clear credentials after TOTP completes
  clearTotpCredentials: () => 
    set({ tempEmailOrUser: null, tempPassword: null }),
}));

export default useTotpCredentialsStore;
