import React from 'react';
import { render, screen } from '@testing-library/react';
import { UiKitContext } from '../contexts/UiKitContext';
import { useUiKitState } from './useUiKitState';

const HookProbe = ({ element }) => {
  const [{ value }] = useUiKitState(element);

  return <span data-testid="value">{JSON.stringify(value)}</span>;
};

const renderProbe = (element, values) =>
  render(
    <UiKitContext.Provider value={{ values }}>
      <HookProbe element={element} />
    </UiKitContext.Provider>
  );

describe('useUiKitState', () => {
  test('preserves zero values from context state', () => {
    renderProbe(
      {
        type: 'linear_scale',
        blockId: 'block-id',
        actionId: 'score',
        initialValue: 5,
      },
      {
        score: {
          value: 0,
        },
      }
    );

    expect(screen.getByTestId('value').textContent).toBe('0');
  });

  test('preserves empty string values from context state', () => {
    renderProbe(
      {
        type: 'plain_text_input',
        blockId: 'block-id',
        actionId: 'message',
        initialValue: 'prefilled',
      },
      {
        message: {
          value: '',
        },
      }
    );

    expect(screen.getByTestId('value').textContent).toBe('""');
  });
});
