import React, { useState } from "react";
import SectionTitle from "./SectionTitle";
// import ReactBD from "./works/ReactBD";
// import Apple from "./works/Apple";
import Freelancer from "./works/Freelancer";
import Startup from "./works/Startup";
// import CollageProject from "./works/collageProject";

const Experience = () => {
    // const [workReactBD, setWorkReactBD] = useState(true);
    const [workFreelancer, setWorkFreelancer] = useState(false);
    const [workTesla, setWorkTesla] = useState(false);
    const [workStartup, setWorkStartup] = useState(true);
    // const [workApple, setWorkApple] = useState(false);

    const handleReactBD = () => {
        // setWorkReactBD(true);
        // setWorkApple(false);
        setWorkTesla(false);
        setWorkStartup(false);
        setWorkFreelancer(false);
    };

    const handleFreelancer = () => {
        // setWorkReactBD(false);
        // setWorkApple(false);
        setWorkTesla(false);
        setWorkStartup(false);
        setWorkFreelancer(true);
    };

    const handleApple = () => {
        // setWorkReactBD(false);
        // setWorkApple(true);
        setWorkTesla(false);
        setWorkStartup(false);
        setWorkFreelancer(false);
    };

    const handleTesla = () => {
        // setWorkReactBD(false);
        // setWorkApple(false);
        setWorkTesla(true);
        setWorkStartup(false);
        setWorkFreelancer(false);
    };
    const handleStartup = () => {
        // setWorkReactBD(false);
        // setWorkApple(false);
        setWorkTesla(false);
        setWorkStartup(true);
        setWorkFreelancer(false);
    };

    return (
        <section
            id="experience"
            className="max-w-containerxs mx-auto py-10 lgl:py-24 px-4"
        >
            <SectionTitle title="where I have Worked" titleNo="02." />
            <div className="w-full mt-10 flex flex-col md:flex-row gap-16">
                <ul className="md:w-32 flex flex-col ">
                    {/* <li
                        onClick={handleReactBD}
                        className={`${
                            workReactBD
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        ReactBD
                    </li> */}
                    {/* <li
                        onClick={handleApple}
                        className={`${
                            workApple
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        Apple
                    </li> */}
                    <li
                        onClick={handleStartup}
                        className={`${
                            workStartup
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        Startup
                    </li>
                    <li
                        onClick={handleFreelancer}
                        className={`${
                            workFreelancer
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        Freelancer
                    </li>
                    {/* <li
                        onClick={handleTesla}
                        className={`${
                            workTesla
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        Tesla
                    </li> */}
                </ul>
                {workFreelancer && <Freelancer />}
                {/* {workApple && <Apple />}
                {workReactBD && <ReactBD />} */}
                {workStartup && <Startup />}
                {/* {workTesla && <CollageProject />} */}
            </div>
        </section>
    );
};

export default Experience;
