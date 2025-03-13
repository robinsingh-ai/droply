import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Droply - Fast, Secure P2P File Transfers</title>
        <meta name="description" content="Share files of any size between devices directly in your browser. No registration, no uploads, complete privacy." />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp; 