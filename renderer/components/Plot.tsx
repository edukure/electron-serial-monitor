import { useContext, useState } from 'react';
import { LineChart, XAxis, YAxis, Line, CartesianGrid, ResponsiveContainer, Brush } from 'recharts';

import { SerialContext } from '../context/SerialContext';

const Plot = () => {
    const { data } = useContext(SerialContext);
    const [initializedAt, setInitializedAt] = useState(new Date(data[0].timestamp).getTime());
    const [dataPointsCount, setDataPointCount] = useState(100);

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                background: 'white',
                border: '1px solid lightgray',
                borderRadius: '2px',
            }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        isAnimationActive={false}
                        dot={false}
                    />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis
                        dataKey="timestamp"
                        tickCount={5}
                        tickFormatter={(str) => {
                            const diff = new Date(str).getTime() - initializedAt;
                            return (diff / 1000).toString();
                        }}
                    />
                    <YAxis />
                    <Brush
                        dataKey="timestamp"
                        height={30}
                        stroke="#8884d8"
                        endIndex={data.length - 1}
                        startIndex={data.length - dataPointsCount > 0 ? data.length - dataPointsCount : 0}
                        onChange={(options ) => {
                            setDataPointCount(options.endIndex - options.startIndex)
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Plot;
