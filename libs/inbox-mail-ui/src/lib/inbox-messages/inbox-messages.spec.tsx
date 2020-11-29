import React from 'react';
import { render } from '@testing-library/react';

import InboxMessages from './inbox-messages';

describe('InboxMessages', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InboxMessages />);
    expect(baseElement).toBeTruthy();
  });
});
