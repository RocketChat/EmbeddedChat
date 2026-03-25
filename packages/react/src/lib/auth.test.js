const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

import { getTokenStorage } from './auth';

describe('Cross-Instance Authentication Isolation', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('Different keys isolate storage (Fix verification)', async () => {
    // Instance A: Uses key 'ec_token_hostA_room1'
    const keyA = 'ec_token_hostA_room1';
    const authA = getTokenStorage(false, keyA);
    const saveTokenA = authA.saveToken;
    const getTokenA = authA.getToken;

    const instanceAToken = 'token_for_instance_A';
    await saveTokenA(instanceAToken);

    // Instance B: Uses key 'ec_token_hostB_room2'
    const keyB = 'ec_token_hostB_room2';
    const authB = getTokenStorage(false, keyB);
    const saveTokenB = authB.saveToken;
    const getTokenB = authB.getToken;

    const instanceBToken = 'token_for_instance_B';
    await saveTokenB(instanceBToken);

    // Verify Isolation
    expect(localStorage.getItem(keyA)).toBe(instanceAToken);
    expect(localStorage.getItem(keyB)).toBe(instanceBToken);

    expect(await getTokenA()).toBe(instanceAToken);
    expect(await getTokenB()).toBe(instanceBToken);

    expect(await getTokenA()).not.toBe(instanceBToken);
  });

  test('Same key still collides (Regression/Expected behavior for same instance)', async () => {
    const key = 'shared_key';
    const auth1 = getTokenStorage(false, key);
    const auth2 = getTokenStorage(false, key);

    await auth1.saveToken('token1');
    await auth2.saveToken('token2');

    expect(await auth1.getToken()).toBe('token2');
  });
});
