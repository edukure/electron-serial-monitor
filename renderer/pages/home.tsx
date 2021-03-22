import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';

const { Text } = Typography;

const { Content, Header } = Layout;

import SerialConnect from '../components/SerialConnect';
import Monitor from '../components/Monitor';

const Home = () => {
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

                    <Button>
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
