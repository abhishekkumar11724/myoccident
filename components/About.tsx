import React from "react";
import SectionTitle from "./SectionTitle";
import { AiFillThunderbolt } from "react-icons/ai";
import { profilePhoto } from "@/public/assets";
import Image from "next/image";
const About = () => {
    return (
        <section
            id="about"
            className="max-w-containerSmall mx-auto py-10 lgl:py-32 flex flex-col gap-8"
        >
            <SectionTitle title="About Me" titleNo="01." />
            <div className="flex flex-col lgl:flex-row gap-16">
                <div className="w-full lgl:w-2/3 text-base text-textDark font-medium flex flex-col gap-4">
                    <p>
                        Hello my name is Abhishek Kumar and I enjoy creating
                        things that live on the internet. My interest in web
                        development started back in 2020 when I decided to try
                        making custom effects for my collage project - turns out
                         cracking cool effects of different sites taught me a
                          lot about HTML & CSS!
                    </p>
                    <p>
                        Fast-forward to today, and I had been working on making 
                        products as a local freelancer,
                        <span className="text-textGreen font-bold">
                            {" "}
                            , and a student-let product creation team. 
                        </span> {" "}
                        currently working with colleagues to make a flutter app 
                        for a early stage startup.
                        <span className="text-textGreen font-bold">
                            GamesON, an app for the sports enthusiasts.
                        </span>
                    </p>
                    <p>
                       I am also very fantasied by the 
                       <span className="text-textGreen font-bold">world of 
                        BlockChain and WEB 3.0 </span>, and had been working on 
                        things that are not very refined yet!
                    </p>
                    <p>
                        Here are a few technologies I have been working with
                        recently:
                    </p>
                    <ul className="max-w-[450px] text-sm font-titleFont grid grid-cols-2 gap-2 mt-6">
                        <li className="flex items-center gap-2">
                            <span className="text-textGreen">
                                <AiFillThunderbolt />
                            </span>
                            <span>Next.js</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-textGreen">
                                <AiFillThunderbolt />
                            </span>
                            <span>Node.js</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-textGreen">
                                <AiFillThunderbolt />
                            </span>
                            <span>JavaScript (ES6+)</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-textGreen">
                                <AiFillThunderbolt />
                            </span>
                            <span>Web3.js </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-textGreen">
                                <AiFillThunderbolt />
                            </span>
                            <span>React.js</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-textGreen">
                                <AiFillThunderbolt />
                            </span>
                            <span>EtherJS</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-textGreen">
                                <AiFillThunderbolt />
                            </span>
                            <span>Tailwindcss</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-textGreen">
                                <AiFillThunderbolt />
                            </span>
                            <span>C/C++</span>
                        </li>
                    </ul>
                </div>

                <div className=" w-full lgl:w-1/3 h-80 relative group">
                    <div className="absolute w-full h-80 -left-6 -top-6 rounded-lg">
                        <div className="w-full h-full relative z-20 flex pl-6 lgl:pl-0">
                            <Image
                                className="rounded-lg h-full object-cover"
                                src={profilePhoto}
                                alt="profilePhoto"
                            />
                            <div className="hidden lgl:inline-block absolute w-full h-80 bg-textGreen/20 rounded-md top-0 left-0 group-hover:bg-transparent duration-300"></div>
                        </div>
                    </div>
                    <div className="hidden lgl:inline-flex w-full h-80 border-2 border-textGreen rounded-md group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-300"></div>
                </div>
            </div>
        </section>
    );
};

export default About;
