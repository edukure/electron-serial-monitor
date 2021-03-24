import { useContext, useEffect } from 'react';
import { List, Input, Button } from 'antd';

import { SerialContext } from '../context/SerialContext';

const Monitor = () => {
    const { data } = useContext(SerialContext);

    useEffect(() => {
        let element = document.getElementById('scroll');
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }, [data]);

    return (
        <div
            style={{
                paddingBottom: '50px',
                height: '100%',
                background: 'white',
                border: '1px solid lightgray',
                borderRadius: '2px',
            }}>
            <div
                style={{
                    height: '50px',
                    background: 'white',
                    display: 'flex',
                    padding: '10px 10px 10px 10px',
                }}>
                <Input style={{ flexGrow: 1, marginRight: '5px' }} placeholder="Write to serial" />
                <Button style={{ height: '100%', width: '100px', flexGrow: 1 }} type="primary">
                    Send
                </Button>
            </div>
            <List
                id="scroll"
                style={{ maxHeight: '100%', overflow: 'auto' }}
                size="small"
                dataSource={data}
                renderItem={(item) => <List.Item>{`${item.timestamp}: ${item.value}`}</List.Item>}
            />
        </div>
    );
};

export default Monitor;
