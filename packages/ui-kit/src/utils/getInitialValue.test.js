import { getInitialValue } from './getInitialValue';

describe('getInitialValue', () => {
  test('preserves empty string initial values', () => {
    expect(
      getInitialValue({
        type: 'plain_text_input',
        actionId: 'message',
        initialValue: '',
      })
    ).toBe('');
  });

  test('preserves zero-valued initial values', () => {
    expect(
      getInitialValue({
        type: 'linear_scale',
        actionId: 'score',
        initialValue: 0,
      })
    ).toBe(0);
  });

  test('preserves empty string option values', () => {
    expect(
      getInitialValue({
        type: 'static_select',
        actionId: 'status',
        initialOption: {
          text: { type: 'plain_text', text: 'None' },
          value: '',
        },
      })
    ).toBe('');
  });
});
