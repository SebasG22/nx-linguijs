# Nx Lingui JS

These instructions are used to setup linguiJS in a nx monorepo. We will use the setup for `nextjs` as react framework, but this is agnostic in the react ecosystem.

### Setup

1. Generate a react application:

```bash
yarn nx g @nrwl/next:application inbox-mail
```

The generate command added two projects to our workspace:

- A React application
- E2E tests for the React application

2. You can serve the newly created application

```bash
yarn nx serve inbox-mail
```

Note: For this example, We will remove all the default `HTML` and `css` generated.

3. Install `@lingui/cli`, `@lingui/macro`, _babel-plugin-macros_ and Babel core packages as a development dependencies and `@lingui/react` as a runtime dependency. 

```bash
yarn add --dev @lingui/cli @babel/core
yarn add --dev @lingui/macro babel-plugin-macros  # required for macros
yarn add @lingui/react
```
4. Add `macros` plugin to Babel config (e.g: .babelrc):
```json
{
  "plugins": [
    "macros"
  ]
}
```
5. Create `.linguirc` file with LinguiJS configuration in root of your project (next to package.json). Replace src with a directory name where you have source files:
```json
{
 "catalogs": [{
   "path": "<rootDir>/apps/inbox-mail/locales/{locale}/messages",
   "include": ["<rootDir>"],
   "exclude": ["**/node_modules/**"]
 }],
 "compileNamespace": "cjs",
"extractBabelOptions": {
   "rootMode": "upward",
 },
 "fallbackLocales": {},
 "format": "minimal",
 "locales": ["en", "es"],
 "orderBy": "messageId",
 "pseudoLocale": "",
 "rootDir": ".",
 "runtimeConfigModule": ["@lingui/core", "i18n"],
 "sourceLocale": "",
}
```
6. Generate the inbox ui library that will contains all the ui components
```
yarn nx g @nrwl/next:library inbox-mail-ui
```
Note: The library was created under the `libs` folder that allow us to shared code easily.
7. Generate the `inbox-messages` component inside the `inbox-mail-ui` library.

```
nx generate @nrwl/next:component --name=inbox-messages --project=inbox-mail-ui
```

### Getting Started 

1. Let’s add all required imports and wrap our app inside `<I18nProvider>`.

```tsx
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


```
### Basic Workflow

1. Now let's add a a translation usign `Trans`. 

```tsx
//app.tsx
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

```

2. Let's extract the messages using the global `linguijs`:

```bash
yarn lingui extract
# Output:
Catalog statistics for nx-linguijs/apps/inbox-mail/locales/{locale}/messages:
```
|  Language  |  Total count  | Missing  |
|     ---    |      ---      |   ---    |
|     en     |       1       |    1     |
|     es     |       1       |    1     |


Note: Nx provides a way to do it with builders but this will be cover in the future.

4. Nice! It seems it worked, we have two message catalogs (one per each locale) with 1 message each. Let’s take a look at file `apps/inbox-mail/locales/es`


Let’s add a Spanish translation:

```json
{
   "Message Inbox": "Aplicacion de mensajeria"
}
```

5. That’s great! So, how we’re going to load it into your app? `LinguiJS` introduces concept of compiled message catalogs. Before we load messages into your app, we need to compile them. As you see in the help in command output, we use compile for that:
```bash
yarn lingui compile
#output:
Compiling message catalogs…
Done!
```

6. What just happened? If you look inside locales directory, you’ll see there’s a new file for each locale: <locale>.js. This file contains compiled message catalog.

7. You can serve the application and make sure the app is translated to the `es` locale.

```
yarn nx serve inbox-mail
```

### Let's use translations from UI components
1. Now let's add a a translation usign `Trans`. 

```tsx
//inbox-messages.tsx
import React from 'react';
import { Trans } from '@lingui/macro';

/* eslint-disable-next-line */
export interface InboxMessagesProps {}

export function InboxMessages(props: InboxMessagesProps) {
  return (
    <>
      <div>
        <Trans>
          <h1>Welcome to inbox-messages!</h1>
        </Trans>
      </div>
    </>
  );
}

export default InboxMessages;


```

2. Let's extract the messages using the global `linguijs`:

```bash
yarn lingui extract
# Output:
Catalog statistics for nx-linguijs/apps/inbox-mail/locales/{locale}/messages:
```
|  Language  |  Total count  | Missing  |
|     ---    |      ---      |   ---    |
|     en     |       2       |    2     |
|     es     |       2       |    1     |


Note: Nx provides a way to do it with builders but this will be cover in the future.

4. Nice! It seems it worked, we have two message catalogs (one per each locale) with 1 message each. Let’s take a look at file `apps/inbox-mail/locales/es`


Let’s add a Spanish translation:

```json
{
   "Message Inbox": "Aplicacion de mensajeria",
   "Welcome to inbox-messages!": "Bienvenido a inbox-messages!"
}
```

5. Before we load messages into your app, we need to compile them. As you see in the help in command output, we use compile for that:
```
yarn lingui compile
#output:
Compiling message catalogs…
Done!
```

6. If you look inside locales directory, you’ll see there’s a new entry for each locale: <locale>.js. This file contains compiled message catalog.

7. You should be able serve the application and make sure the app is translated to the `es` locale but there is an error reported in the linguiJS Repo due some unclear configurations for monorepos.

You get several errors when trying to use it with other components:

```bash
Failed to compile
../../node_modules/@lingui/conf/index.js:22:0
Module not found: Can't resolve 'fs'
null
This error occurred during the build process and can only be dismissed by fixing the error.
```
and restarting the server just throw similar errors:
```bash
error - ../../node_modules/@lingui/conf/index.js:22:0
Module not found: Can't resolve 'fs'
null
Locale data for locale "es" not loaded. Plurals won't work correctly.
Warning: React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely
 forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
    at InboxMessages
    at Index
    at I18nProvider (C:\Users\SebasG\Documents\nx-linguijs\node_modules\@lingui\react\cjs\react.development.js:46:19)
    at CustomApp (C:\Users\SebasG\Documents\nx-linguijs\dist\apps\inbox-mail\.next\server\pages\_app.js:192:3)
    at AppContainer (C:\Users\SebasG\Documents\nx-linguijs\node_modules\next\dist\next-server\server\render.js:23:748)
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot
 to export your component from the file it's defined in, or you might have mixed up default and named imports.

```

Please check the bug reported:
https://github.com/lingui/js-lingui/issues/894

One clue of this issues is the message error that says not can't resolve a module on the package `@lingui/conf`. But if you want to go deeper, you can comment the `<Trans>` and the app should run as expected but without translations.

```tsx
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
```

This project was generated using [Nx](https://nx.dev).


<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="50"></p>

### Are you interested in nx repo ?
Please check this guide [Nx Guide](./nx.md)
