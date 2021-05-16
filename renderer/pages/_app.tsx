import type { AppProps } from 'next/app';
import Head from 'next/head';

import 'antd/dist/antd.css';

import { SerialProvider } from '../context/SerialContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Serial Monitor</title>
            </Head>

            <SerialProvider>
                <Component {...pageProps} />
            </SerialProvider>

        </>
    );
};

export default MyApp;
