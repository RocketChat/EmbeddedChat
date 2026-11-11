import React from 'react';
import { render, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider } from '@embeddedchat/ui-elements';
import { RCInstanceProvider } from '../../context/RCInstance';
import TypingUsers from './TypingUsers';

const renderTypingUsers = (props) => {
  let typingListener;
  const RCInstance = {
    addTypingStatusListener: (listener) => {
      typingListener = listener;
    },
    removeTypingStatusListener: jest.fn(),
  };

  const result = render(
    <ThemeProvider>
      <RCInstanceProvider value={{ RCInstance }}>
        <TypingUsers {...props} />
      </RCInstanceProvider>
    </ThemeProvider>
  );

  return { ...result, setTyping: (users) => act(() => typingListener(users)) };
};

describe('TypingUsers accessibility', () => {
  test('has no violations when nobody is typing', async () => {
    const { container } = renderTypingUsers();
    expect(await axe(container)).toHaveNoViolations();
  });

  test('has no violations while users are typing', async () => {
    const { container, setTyping } = renderTypingUsers();
    setTyping(['alice', 'bob']);
    expect(container).toHaveTextContent('alice and bob are typing...');
    expect(await axe(container)).toHaveNoViolations();
  });
});
