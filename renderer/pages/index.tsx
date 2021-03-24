import MonitorPageLayout from "../components/MonitorPageLayout";

import {SerialProvider} from "../context/SerialContext"

const Home = () => {

    return (
        <SerialProvider>
            <MonitorPageLayout />
        </SerialProvider>
    );

} 

export default Home;