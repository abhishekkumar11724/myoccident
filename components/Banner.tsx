import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { myphoto } from "@/public/assets";
const Banner = () => {
    return (
        <div
        id="home" 
        className=" flex flex-row justify-center ">
        <section
            
            className="max-w-contentContainer py-10 mdl:py-24 flex flex-col gap-4 lgl:gap-8 mdl:px-10 px-4  flex flex-col"
        >
            
            <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-lg font-titleFont tracking-wide lgl:w-fit text-textGreen"
            >
                Hi, my name is
            </motion.h3>
            <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-4xl lgl:text-6xl font-titleFont font-semibold lgl:w-fit flex flex-col"
            >
                Abhishek Kumar.{" "}
                <span className="text-textDark mt-2 lgl:mt-4">
                    I build things for the web.
                </span>
            </motion.h1>
            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-base md:max-w-[650px] text-textDark lgl:w-fit front-medium"
            >
                I am a web developer with 1+ years of experience in React. I
                have a strong foundation in front-end & back-end development and
                am skilled in creating user-friendly and responsive web
                applications using React and its ecosystem.{" "}
                <a href="https://www.myoccident.ml" target="_blank">
                    <span className="text-textGreen inline-flex relative cursor-pointer h-7 overflow-x-hidden group">
                        {" "}
                        Learn More
                        <span className="absolute w-full h-[1px] bg-textGreen left-0 bottom-1 -translate-x-[110%] group-hover:translate-x-0 transition-transform duration-500"></span>
                    </span>
                </a>
            </motion.p>
            <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="w-52 h-14 text-sm font-titleFont border border-textGreen  rounded-md text-textGreen tracking-wide hover:bg-hoverColor duration-300"
            >
                Check out my Project!
            </motion.button>
            



        </section>

        <section className="max-w-contentContainer py-10 mdl:py-24 flex flex-col gap-4   flex flex-col"
         >
            <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mx-auto">
                <Image src={myphoto} className="w-[600px]" alt="profile"></Image>
            </motion.div>
                </section>
                </div>
    );
};

export default Banner;
