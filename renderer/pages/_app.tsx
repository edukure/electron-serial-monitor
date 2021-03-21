import type { AppProps } from 'next/app'
import Head from 'next/head'

import 'antd/dist/antd.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Serial Monitor</title>
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp