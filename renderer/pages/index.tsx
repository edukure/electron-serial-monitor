import HomeLayout from '../components/HomeLayout';

import { SerialProvider } from '../context/SerialContext';

const Home = () => {
    return (
        <SerialProvider>
            <HomeLayout />
        </SerialProvider>
    );
};

export default Home;
