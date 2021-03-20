import React, { useEffect } from 'react';
import { Layout, Form, Select, Button } from 'antd';
import electron from 'electron';

const { Content } = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

const Home = () => {
    const ipcRenderer = electron.ipcRenderer || false;

    useEffect(() => {
        refreshSerialPorts();
    }, []);

    const refreshSerialPorts = () => {
        if (ipcRenderer) {
            if (!ipcRenderer.eventNames().includes('serial-ports')) {
                ipcRenderer.on('serial-ports', (event, args) => {
                    console.log(args);
                });
                console.log("event added")
            }

            ipcRenderer.send('serial-refresh-ports');
        }
    };

    return (
        <React.Fragment>
            <Content style={{ padding: 48 }}>
                <Form layout="horizontal">
                    <FormItem label="Select" labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
                        <Select size="large" defaultValue="lucy" style={{ width: 192 }} >
                            <Option value="jack">jack</Option>
                            <Option value="lucy">lucy</Option>
                            <Option value="disabled" disabled>
                                disabled
                            </Option>
                            <Option value="yiminghe">yiminghe</Option>
                        </Select>
                    </FormItem>

                    <FormItem style={{ marginTop: 48 }} wrapperCol={{ span: 8, offset: 8 }}>
                        <Button size="large" type="primary" htmlType="submit" onClick={refreshSerialPorts}>
                            Refresh
                        </Button>
                    </FormItem>
                </Form>
            </Content>
        </React.Fragment>
    );
};

export default Home;
