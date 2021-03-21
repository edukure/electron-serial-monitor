import React, { useEffect } from 'react';
import { Layout, Form, Select, Button } from 'antd';

const { Content, Header } = Layout;


import SerialConnect from "../components/SerialConnect";

const Home = () => {

    return (
        <Layout >
            <Header style={{background: "#00ADB2"}}>

                <SerialConnect />
            </Header>
        </Layout>
    );
};

export default Home;
