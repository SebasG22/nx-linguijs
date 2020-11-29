import React from 'react';
import { Trans } from '@lingui/macro';

/* eslint-disable-next-line */
export interface InboxMessagesProps {}

export function InboxMessages(props: InboxMessagesProps) {
  return (
    <>
      <div>
        {/* <Trans> */}
          <h1>Welcome to inbox-messages!</h1>
        {/* </Trans> */}
      </div>
    </>
  );
}

export default InboxMessages;
