import Head from 'next/head';
import getConfig from 'next/config';
import type { AppProps } from 'next/app';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import ErrorBoundary from 'shared/components/errorBoundary/ErrorBoundary';
import 'shared/styles/main.scss';
const isProduction = process.env.NODE_ENV === 'production';
const isBrowser = typeof window !== 'undefined';

if (!isProduction && isBrowser) {
  const axe = require('react-axe');
  const AXE_DELAY = 1000;
  axe(React, ReactDOM, AXE_DELAY);
}

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const config = getConfig();
  const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;
  Sentry.init({
    enabled: isProduction,
    integrations: [
      new RewriteFrames({
        iteratee: (frame) => {
          if (frame.filename) {
            frame.filename = frame.filename.replace(distDir, 'app:///_next');
          }
          return frame;
        },
      }),
    ],
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
}

type Props = AppProps & { err: any };

const App = ({ Component, pageProps, err }: Props) => (
  <>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, user-scalable=yes, initial-scale=1.0, viewport-fit=cover"
      />
      <meta property="og:type" content="website" />
    </Head>
    <ErrorBoundary>
      <Component {...pageProps} err={err} />
    </ErrorBoundary>
  </>
);
export default App;
