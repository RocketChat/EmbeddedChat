import React from 'react';
import { render } from '@testing-library/react';

import { RCComponent } from './index';

describe('Rendering of RCComponent Component', () => {
  test('renders the RCComponent component', () => {
    render(<RCComponent />);
  });

  test('if isClosable = true, and setClosableState is not provided.. throw an error', () => {
    expect(() => {
      render(<RCComponent isClosable />);
    }).toThrowError();
  });
});
