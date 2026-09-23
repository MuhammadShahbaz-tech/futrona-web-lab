import "./Home.css";

import Hero from "../../sections/Home/Hero/Hero";
import Introduction from "../../sections/Home/Introduction/Introduction";
import LabPreview from "../../sections/Home/LabPreview/LabPreview";

function Home() {
    return (
        <>
            <Hero />
            <Introduction />
            <LabPreview />
        </>
    );
}

export default Home;