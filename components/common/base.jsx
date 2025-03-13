import React from 'react';
import PropTypes from 'prop-types';
import Head from "next/head";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import '../../styles/gg.css';
import '../../styles/animate.css';
import '../../styles/styles.css';

const seoTags = {
    "siteName": "Droply",
    "tagLine": "Fast, Simple & Secure Peer-To-Peer File Transfer",
    "description": "Share files between devices right from your browser, without even needing to install an app or creating a dedicated hotspot."
};

const Base = ({ children, meta }) => {

    const title = `${meta && meta.title ? `${meta.title} |` : '' } ${seoTags.siteName} - ${seoTags.tagLine}`;

    const GoogleAnalyticsID = 'UA-171591742-1';

    return <React.Fragment>
        <Head>
            <title>{title}</title>
            <meta charSet='utf-8'/>
            <meta name='theme-color' content='#3A97D6' />
            <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
            <meta name="description" content={meta && meta.description ? meta.description : seoTags.description} />
            <meta name="twitter:title" content={title} />
            <meta property="og:title" content={title} />
            <meta name="viewport" content="width=device-width, minimum-scale=1, shrink-to-fit=no, initial-scale=1, user-scalable=no" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="icon" type="image/png" href="/images/icons/icon.png" />
            <link rel="apple-touch-icon" href="/images/icons/icon.png" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="msapplication-TileColor" content="#FFFFFF" />
            <meta name="msapplication-TileImage" content="/images/icons/icon.png" />
            <meta name="msapplication-starturl" content="/" />
            {   meta && meta.image && <meta property="og:image" content={meta.image} /> }
            {   GoogleAnalyticsID &&
                <React.Fragment>
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=${GoogleAnalyticsID}`} />
                    <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GoogleAnalyticsID}');`}} />
                </React.Fragment>
            }
        </Head>
        <div className="app light dark-mode animated fadeIn">
            {children}
            <ToastContainer />
        </div>
    </React.Fragment>
};

Base.propTypes  = {
    children: PropTypes.node,
    meta: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.string,
    })
};

export default Base;