
import { useContext } from 'react';


import { SerialContext } from '../context/SerialContext';


const Plot = () => {
    const {data} = useContext(SerialContext)

    return (
        <div
        style={{
            paddingBottom: '50px',
            height: '100%',
            background: 'white',
            border: '1px solid lightgray',
            borderRadius: '2px',
        }}>
      
        {data && data.map(d => <p>{d.value}</p>)}
    </div>
    );
};

export default Plot;