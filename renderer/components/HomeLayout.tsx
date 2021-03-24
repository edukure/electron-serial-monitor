import electron from 'electron';
import React, { useContext, useState } from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { LineChartOutlined, CodeOutlined } from '@ant-design/icons';

const { Text } = Typography;

const { Content, Header } = Layout;

import SerialConnect from './SerialConnect';
import Monitor from './Monitor';
import Plot from "./Plot";

const HomeLayout = () => {
    const [isMonitorShowing, setIsMonitorShowing] = useState(true);
    const [isPlotShowing, setIsPlotShowing] = useState(false);


    const handleShowPlot = () => {
        setIsPlotShowing(true);
        setIsMonitorShowing(false);
    };

    const handleShowMonitor = () => {
        setIsMonitorShowing(true);
        setIsPlotShowing(false);
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ background: '#00ADB2' }}>
                <SerialConnect />
            </Header>
            <Layout>
                <div
                    style={{
                        padding: '10px 25px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Space>
                        <Button onClick={handleShowMonitor} icon={<CodeOutlined />}
                        type={isMonitorShowing ? "primary" : "default"}>
                            Monitor
                            
                        </Button>

                        <Button onClick={handleShowPlot} icon={<LineChartOutlined />}
                        type={isPlotShowing ? "primary" : "default"}>
                            Plotter
                            
                        </Button>
                    </Space>
                </div>

                <Content style={{ padding: '10px' }}>
                    {isMonitorShowing && <Monitor />}
                    {isPlotShowing && <Plot />}
                    
                </Content>
            </Layout>
        </Layout>
    );
};

export default HomeLayout;
