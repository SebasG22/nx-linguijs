import React from 'react';
import { AppProps } from 'next/app';
import './styles.css';

import { I18nProvider } from '@lingui/react';
import { messages } from '../../inbox-mail/locales/en/messages';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/macro';

i18n.load('es', messages);
i18n.activate('es');

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <I18nProvider i18n={i18n}>
        <h1>
          <Trans>Message Inbox</Trans>
        </h1>
        <Component {...pageProps} />
      </I18nProvider>
    </>
  );
}

export default CustomApp;
