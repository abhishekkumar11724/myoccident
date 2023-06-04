import React, { useState } from "react";
import SectionTitle from "./SectionTitle";
import ReactBD from "./works/ReactBD";
import Apple from "./works/Apple";
import Amazon from "./works/Amazon";
import Microsoft from "./works/Microsoft";
import Tesla from "./works/Tesla";

const Experience = () => {
    const [workReactBD, setWorkReactBD] = useState(true);
    const [workAmazon, setWorkAmazon] = useState(false);
    const [workTesla, setWorkTesla] = useState(false);
    const [workMicrosoft, setWorkMicrosoft] = useState(false);
    const [workApple, setWorkApple] = useState(false);

    const handleReactBD = () => {
        setWorkReactBD(true);
        setWorkApple(false);
        setWorkTesla(false);
        setWorkMicrosoft(false);
        setWorkAmazon(false);
    };

    const handleAmazon = () => {
        setWorkReactBD(false);
        setWorkApple(false);
        setWorkTesla(false);
        setWorkMicrosoft(false);
        setWorkAmazon(true);
    };

    const handleApple = () => {
        setWorkReactBD(false);
        setWorkApple(true);
        setWorkTesla(false);
        setWorkMicrosoft(false);
        setWorkAmazon(false);
    };

    const handleTesla = () => {
        setWorkReactBD(false);
        setWorkApple(false);
        setWorkTesla(true);
        setWorkMicrosoft(false);
        setWorkAmazon(false);
    };
    const handleMicrosoft = () => {
        setWorkReactBD(false);
        setWorkApple(false);
        setWorkTesla(false);
        setWorkMicrosoft(true);
        setWorkAmazon(false);
    };

    return (
        <section
            id="experience"
            className="max-w-containerxs mx-auto py-10 lgl:py-24 px-4"
        >
            <SectionTitle title="where I have Worked" titleNo="02." />
            <div className="w-full mt-10 flex flex-col md:flex-row gap-16">
                <ul className="md:w-32 flex flex-col ">
                    <li
                        onClick={handleReactBD}
                        className={`${
                            workReactBD
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        ReactBD
                    </li>
                    <li
                        onClick={handleApple}
                        className={`${
                            workApple
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        Apple
                    </li>
                    <li
                        onClick={handleMicrosoft}
                        className={`${
                            workMicrosoft
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        Microsoft
                    </li>
                    <li
                        onClick={handleAmazon}
                        className={`${
                            workAmazon
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        Amazon
                    </li>
                    <li
                        onClick={handleTesla}
                        className={`${
                            workTesla
                                ? "border-l-textGreen text-textGreen"
                                : "border-l-hoverColor text-textDark"
                        } border-l-2  bg-transparent hover:bg-[#737373] py-3 px-8 text-sm cursor-pointer duration-300 font-medium`}
                    >
                        Tesla
                    </li>
                </ul>
                {workAmazon && <Amazon />}
                {workApple && <Apple />}
                {workReactBD && <ReactBD />}
                {workMicrosoft && <Microsoft />}
                {workTesla && <Tesla />}
            </div>
        </section>
    );
};

export default Experience;
