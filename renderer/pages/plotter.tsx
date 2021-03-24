import electron from 'electron';
import Head from 'next/head';

import { Layout } from 'antd';
import { useEffect, useState } from 'react';
const { Content } = Layout;

import { Data  } from '../../main/helpers/SerialCommunication';


const Plotter = () => {
    const [serialData, setSerialData] = useState<Data[]>();

    const ipcRenderer = electron.ipcRenderer || false;

    useEffect(() => {
        if(ipcRenderer) {
            ipcRenderer.on("plot-data", (event, data: Data[]) => {
                setSerialData([...data])
            })
        }
    },[])


    return (
        <>
            <Head>
                <title>Serial Plotter</title>
            </Head>
            <Layout style={{ height: '100vh' }}>
                <Content>{serialData && serialData.map(d => <p>{d.value}</p>)}</Content>
            </Layout>
        </>
    );
};

export default Plotter;
