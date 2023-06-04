import React from "react";
import SectionTitle from "./SectionTitle";
import Image from "next/image";
import { img_1, img_2, img_3 } from "@/public/assets";
import { AiOutlineYoutube } from "react-icons/ai";
import { TbBrandGithub } from "react-icons/tb";
import { RxOpenInNewWindow } from "react-icons/rx";
const Projects = () => {
    return (
        <section
            id="project"
            className="max-w-container mx-auto lgl:px-20 py-24"
        >
            <SectionTitle title="Some Things I have Built" titleNo="03." />
            <div className="w-full flex flex-col items-center justify-between gap-28 mt-10">
                {/* project one */}
                <div className="w-full flex flex-col items-center justify-center gap-28 mt-10">
                    <div className="flex flex-col xl:flex-row gap-6">
                        <a
                            className="w-full xl:w-1/2 h-auto relative group"
                            href="https://crowd-funding-minor.netlify.app/"
                            target="_blank"
                        >
                            <div>
                                <Image
                                    className="w-full h-full object-contain"
                                    src={img_1}
                                    alt="midjourny"
                                />
                            </div>
                        </a>
                        <div className="w-full xl:w-1/2 flex flex-col gap-6 lgl:justify-between items-end text-right xl:-ml-16 z-10">
                            <p className="font-titleFont text-textGreen text-sm tracking-wide">
                                Featured Project
                            </p>
                            <h3 className="text-2xl font-bold">
                                Crowd Funding Project
                            </h3>
                            <p className="bg-[#BFBFBF] text-sm md-text-base p-2 md:p-6 rounded-md">
                            A blockchain-based
                            crowdfunding project allows individuals and organizations to raise funds
                            using a decentralized platform. Investors send cryptocurrency to a smart
                            contract on the blockchain, providing transparency, security, and reduced
                            costs.
                                {/* <span className="text-textGreen">o-auth</span>
                                and then make the purchase using and then make
                                the purchase using
                                <span className="text-textGreen">stripe</span> */}
                            </p>
                            <ul className="text-xs md:text-sm font-titleFont tracking-wide flex gap-2 md:gap-5 justify-between text-textDark">
                                <li>Nextjs</li>
                                <li>Solidity</li>
                                <li>etherJS</li>
                                <li>Redux</li>
                                <li>Web3JS</li>
                            </ul>
                            <div className="text-2xl flex gap-4">
                                <a
                                    className="hover:text-textGreen duration-300"
                                    target="_blank"
                                    href="http://github.com/abhishekkumar11724/crowd-funding-minor"
                                >
                                    <TbBrandGithub />
                                </a>
                                {/* <a
                                    className="hover:text-textGreen duration-300"
                                    target="_blank"
                                    href="https://www.github.com/abhishek"
                                >
                                    <AiOutlineYoutube />
                                </a> */}
                                <a
                                    className="hover:text-textGreen duration-300"
                                    target="_blank"
                                    href="https://crowd-funding-minor.netlify.app/"
                                >
                                    <RxOpenInNewWindow />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* project two */}
                <div className="w-full flex flex-col items-center justify-center gap-28 mt-10">
                    <div className="flex flex-col xl:flex-row-reverse gap-6">
                        <a
                            className="w-full xl:w-1/2 h-auto relative group"
                            href="https://github.com/abhishekkumar11724/vision-trades-template-site"
                            target="_blank"
                        >
                            <div>
                                <Image
                                    className="w-full h-full object-contain"
                                    src={img_2}
                                    alt="frost"
                                />
                            </div>
                        </a>
                        <div className="w-full xl:w-1/2 flex flex-col gap-6 lgl:justify-between items-end text-right  z-10">
                            <p className="font-titleFont text-textGreen text-sm tracking-wide">
                                Featured Project
                            </p>
                            <h3 className="text-2xl font-bold">
                                Vision Trades
                            </h3>
                            <p className="bg-[#BFBFBF] text-sm md-text-base p-2 md:p-6 rounded-md xl:-mr-16">
                                <span className="text-textGreen font-bold">ReactJS Template Site</span>
                                , illustrating the Skills of the developer.
                                A Site that is well thought of and designed & developed 
                                 keeping every aspect of user likeliness.                                
                                
                            </p>
                            <ul className="text-xs md:text-sm font-titleFont tracking-wide flex gap-2 md:gap-5 justify-between text-textDark">
                                <li>Reactjs</li>
                                <li>Vite</li>
                                <li>TailwindCSS</li>
                                {/* <li>Stripe</li>
                                <li>Vercel Development</li> */}
                            </ul>
                            <div className="text-2xl flex gap-4">
                                <a
                                    className="hover:text-textGreen duration-300"
                                    target="_blank"
                                    href="https://abhishekkumar11724.github.io/vision-trades-template-site/"
                                >
                                    <TbBrandGithub />
                                </a>
                                {/* <a
                                    className="hover:text-textGreen duration-300"
                                    target="_blank"
                                    href="https://www.github.com/abhishek"
                                >
                                    <AiOutlineYoutube />
                                </a> */}
                                <a
                                    className="hover:text-textGreen duration-300"
                                    target="_blank"
                                    href="https://github.com/abhishekkumar11724/vision-trades-template-site"
                                >
                                    <RxOpenInNewWindow />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* project three */}
                <div className="w-full flex flex-col items-center justify-center gap-28 mt-10">
                    <div className="flex flex-col xl:flex-row gap-6">
                        <a
                            className="w-full xl:w-1/2 h-auto relative group"
                            href="https://gpt3-template-site.vercel.app/"
                            target="_blank"
                        >
                            <div>
                                <Image
                                    className="w-full h-full object-contain"
                                    src={img_3}
                                    alt="city"
                                />
                            </div>
                        </a>
                        <div className="w-full xl:w-1/2 flex flex-col gap-6 lgl:justify-between items-end text-right xl:-ml-16 z-10">
                            <p className="font-titleFont text-textGreen text-sm tracking-wide">
                                Featured Project
                            </p>
                            <h3 className="text-2xl font-bold">
                                Chat GPT-3
                            </h3>
                            <p className="bg-[#BFBFBF] text-sm md-text-base p-2 md:p-6 rounded-md">
                                <span className="text-textGreen font-bold">NextJS template site</span>
                                incorporating modern and flawless design, depicting 
                                what if, Chat-GPT-3&apos;s was redesigned.
                                
                            </p>
                            <ul className="text-xs md:text-sm font-titleFont tracking-wide flex gap-2 md:gap-5 justify-between text-textDark">
                                <li>Nextjs</li>
                                <li>Typescript</li>
                                <li>ReactJS</li>
                                <li>CSS</li>
                                {/* <li>Vercel Development</li> */}
                            </ul>
                            <div className="text-2xl flex gap-4">
                                <a
                                    className="hover:text-textGreen duration-300"
                                    target="_blank"
                                    href="https://gpt3-template-site.vercel.app/"
                                >
                                    <TbBrandGithub />
                                </a>
                                {/* <a
                                    className="hover:text-textGreen duration-300"
                                    target="_blank"
                                    href="https://www.github.com/abhishek"
                                >
                                    <AiOutlineYoutube />
                                </a> */}
                                <a
                                    className="hover:text-textGreen duration-300"
                                    target="_blank"
                                    href="https://github.com/abhishekkumar11724/gpt3-template-site"
                                >
                                    <RxOpenInNewWindow />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
