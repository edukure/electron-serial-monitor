import React, { useEffect } from 'react';
import { Layout, Form, Select, Button } from 'antd';

const { Content, Header } = Layout;


import SerialConnect from "../components/SerialConnect";
import Monitor from "../components/Monitor";

const Home = () => {

    return (
        <Layout style={{height: "100vh"}}>
            <Header style={{background: "#00ADB2"}}>

                <SerialConnect />
            </Header>
            <Content style={{height: "100%"}}>
                <Monitor />
            </Content>
        </Layout>
    );
};

export default Home;
