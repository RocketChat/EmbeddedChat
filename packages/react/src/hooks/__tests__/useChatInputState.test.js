import React from 'react';
import { render, act } from '@testing-library/react';
import useChatInputState from '../useChatInputState';

// ---------------------------------------------------------------------------
// Helper: renders the hook inside a minimal component and returns a live ref
// to the hook's return value. Works with @testing-library/react v12 which
// does not expose renderHook.
//
// IMPORTANT: always read `result.current` AFTER act() — never destructure
// `current` up front, because re-renders reassign `result.current` to the
// new hook return value while a destructured copy keeps pointing to the old
// object.
// ---------------------------------------------------------------------------
function renderHookShim() {
  const result = { current: null };

  const TestComponent = () => {
    result.current = useChatInputState();
    return null;
  };

  render(<TestComponent />);
  return result;
}

// ---------------------------------------------------------------------------
// 1. Initial state
// ---------------------------------------------------------------------------
describe('useChatInputState – initial state', () => {
  it('starts with empty text and zero cursor position', () => {
    const result = renderHookShim();
    expect(result.current.inputState.text).toBe('');
    expect(result.current.inputState.cursorPosition).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 2. setText
// ---------------------------------------------------------------------------
describe('useChatInputState – setText', () => {
  it('updates the text field', () => {
    const result = renderHookShim();
    act(() => result.current.setText('hello world'));
    expect(result.current.inputState.text).toBe('hello world');
  });

  it('does not change cursor position when only text is set', () => {
    const result = renderHookShim();
    act(() => result.current.setText('some text'));
    expect(result.current.inputState.cursorPosition).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 3. setCursorPosition
// ---------------------------------------------------------------------------
describe('useChatInputState – setCursorPosition', () => {
  it('updates cursor position', () => {
    const result = renderHookShim();
    act(() => result.current.setCursorPosition(5));
    expect(result.current.inputState.cursorPosition).toBe(5);
  });

  it('does not change text when only cursor is updated', () => {
    const result = renderHookShim();
    act(() => result.current.setText('hello'));
    act(() => result.current.setCursorPosition(3));
    expect(result.current.inputState.text).toBe('hello');
    expect(result.current.inputState.cursorPosition).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// 4. clearInput
// ---------------------------------------------------------------------------
describe('useChatInputState – clearInput', () => {
  it('resets text and cursorPosition to initial values', () => {
    const result = renderHookShim();
    act(() => result.current.setText('typing something'));
    act(() => result.current.setCursorPosition(8));
    act(() => result.current.clearInput());
    expect(result.current.inputState.text).toBe('');
    expect(result.current.inputState.cursorPosition).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 5. getFinalMarkdown – the core bug fix
//
// The old code mutated `quotedMessages` inside Promise.all.map() and then
// joined the cumulative array, producing duplicated link prefixes for every
// quote after the first. These tests verify the new behaviour is correct.
// ---------------------------------------------------------------------------
describe('useChatInputState – getFinalMarkdown', () => {
  const makeLinkFn = (map) => (id) => Promise.resolve(map[id]);

  it('returns plain text when there are no quotes', async () => {
    const hookRef = renderHookShim();
    const result = await hookRef.current.getFinalMarkdown('hello', [], makeLinkFn({}));
    expect(result).toBe('hello');
  });

  it('returns plain text when quotes array is null/undefined', async () => {
    const hookRef = renderHookShim();
    const result = await hookRef.current.getFinalMarkdown(
      'hello',
      null,
      makeLinkFn({})
    );
    expect(result).toBe('hello');
  });

  it('prepends a single quote link separated by a newline', async () => {
    const hookRef = renderHookShim();
    const quotes = [{ _id: 'msg1', msg: 'original message', attachments: undefined }];
    const linkMap = { msg1: 'https://host/channel/general/?msg=msg1' };

    const result = await hookRef.current.getFinalMarkdown(
      'my reply',
      quotes,
      makeLinkFn(linkMap)
    );

    expect(result).toBe(
      '[ ](https://host/channel/general/?msg=msg1)\nmy reply'
    );
  });

  it('prepends multiple quote links WITHOUT duplication (old bug regression)', async () => {
    // OLD behaviour: link1 was emitted twice → "[ ](link1)[ ](link1)[ ](link2)\ntext"
    // NEW behaviour: each link appears exactly once  → "[ ](link1)[ ](link2)\ntext"
    const hookRef = renderHookShim();
    const quotes = [
      { _id: 'msg1', msg: 'first quoted', attachments: undefined },
      { _id: 'msg2', msg: 'second quoted', attachments: undefined },
    ];
    const linkMap = {
      msg1: 'https://host/channel/general/?msg=msg1',
      msg2: 'https://host/channel/general/?msg=msg2',
    };

    const result = await hookRef.current.getFinalMarkdown(
      'my reply',
      quotes,
      makeLinkFn(linkMap)
    );

    expect(result).toBe(
      '[ ](https://host/channel/general/?msg=msg1)' +
        '[ ](https://host/channel/general/?msg=msg2)' +
        '\nmy reply'
    );
    // Ensure first link does NOT appear twice (the old bug)
    const occurrences = (result.match(/msg1/g) || []).length;
    expect(occurrences).toBe(1);
  });

  it('skips quotes that have neither msg nor attachments', async () => {
    const hookRef = renderHookShim();
    const quotes = [
      { _id: 'msg1', msg: undefined, attachments: undefined },
      { _id: 'msg2', msg: 'valid message', attachments: undefined },
    ];
    const linkMap = { msg2: 'https://host/channel/general/?msg=msg2' };

    const result = await hookRef.current.getFinalMarkdown(
      'reply',
      quotes,
      makeLinkFn(linkMap)
    );

    // Only msg2 link should appear; msg1 had no content so it's skipped
    expect(result).toBe('[ ](https://host/channel/general/?msg=msg2)\nreply');
    expect(result).not.toContain('msg1');
  });

  it('returns plain text if all quotes have no msg or attachments', async () => {
    const hookRef = renderHookShim();
    const quotes = [{ _id: 'msg1', msg: undefined, attachments: undefined }];

    const result = await hookRef.current.getFinalMarkdown(
      'just text',
      quotes,
      makeLinkFn({})
    );

    expect(result).toBe('just text');
  });
});
