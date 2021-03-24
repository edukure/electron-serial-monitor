import electron from "electron"
import React, { useContext } from 'react';
import { Layout, Typography, Button } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';

const { Text } = Typography;

const { Content, Header } = Layout;

import SerialConnect from '../components/SerialConnect';
import Monitor from '../components/Monitor';
import { SerialContext } from '../context/SerialContext';

const Home = () => {
    const {setIsPlotterOpen} = useContext(SerialContext);

    const ipcRenderer = electron.ipcRenderer || false;

    const handleOpenPlotter = () => {
        if(ipcRenderer) {
            ipcRenderer.send("open-plotter-window");
        }
        setIsPlotterOpen(true);
        console.log("LUL")
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ background: '#00ADB2' }}>
                <SerialConnect />
            </Header>

            <Layout>
                <Header
                    style={{
                        padding: '0 25px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#f0f5ff',
                    }}>
                    <Text>Monitor</Text>

                    <Button onClick={handleOpenPlotter}>
                        Plotter
                        <LineChartOutlined />
                    </Button>
                </Header>

                <Content style={{ padding: '10px' }}>
                    <Monitor />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
