import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';

// Global CSS imports
import 'react-toastify/dist/ReactToastify.css';
import '../styles/bootstrap.min.css';
import '../styles/gg.css';
import '../styles/animate.css';
import '../styles/styles.css';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
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
}

export default MyApp; 