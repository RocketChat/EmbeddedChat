import test, { describe } from "node:test";
import assert from "node:assert/strict";

describe("EmbeddedChatApi updateUserUsername validation", () => {
  const usernameRegExp = /^[0-9a-zA-Z-_.]+$/;

  const validateAndFormatUsername = (username) => {
    const newUserName = username.replace(/\s/g, ".").toLowerCase();
    const isValid = usernameRegExp.test(newUserName);
    return { newUserName, isValid };
  };

  test("accepts valid alphanumeric username", () => {
    const { newUserName, isValid } = validateAndFormatUsername("ValidUser456");
    assert.equal(newUserName, "validuser456");
    assert.equal(isValid, true);
  });

  test("normalizes spaces to dots and validates correctly", () => {
    const { newUserName, isValid } = validateAndFormatUsername("John Doe");
    assert.equal(newUserName, "john.doe");
    assert.equal(isValid, true);
  });

  test("accepts allowed characters: hyphens, underscores, dots", () => {
    const { newUserName, isValid } =
      validateAndFormatUsername("john-doe_test.dev");
    assert.equal(newUserName, "john-doe_test.dev");
    assert.equal(isValid, true);
  });

  test("rejects usernames containing special symbols like @, !, #, $, %, etc.", () => {
    assert.equal(validateAndFormatUsername("john@doe.com").isValid, false);
    assert.equal(validateAndFormatUsername("user!name").isValid, false);
    assert.equal(validateAndFormatUsername("user#tag").isValid, false);
    assert.equal(validateAndFormatUsername("user$dollar").isValid, false);
    assert.equal(validateAndFormatUsername("user%percent").isValid, false);
    assert.equal(validateAndFormatUsername("user*star").isValid, false);
  });

  test('rejects usernames containing parentheses (e.g., "(Admin)")', () => {
    const { newUserName, isValid } =
      validateAndFormatUsername("John Doe (Admin)");
    assert.equal(newUserName, "john.doe.(admin)");
    assert.equal(isValid, false);
  });

  test("rejects empty usernames", () => {
    assert.equal(validateAndFormatUsername("").isValid, false);
  });
});
