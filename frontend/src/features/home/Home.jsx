
import Hero from "./Hero";
import HomeMarquee from "./HomeMarquee";
// import Statement from "./Statement";
import HomeServices from "./HomeServices";
// import HomeProcess from "./HomeProcess";
import FeaturedWork from "../works/FeaturedWork";
import CTA from "./CTA";

const Home = () => {
    return (
        <>
            <Hero />
            <HomeMarquee />
            {/* <Statement /> */}
            <HomeServices />
            {/* <HomeProcess /> */}
            <FeaturedWork />
            <CTA />
        </>
    );
};

export default Home;
