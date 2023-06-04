import React, { useState } from "react";
import ArchiveCard from "./ArchiveCard";
import { motion } from "framer-motion";

const Archive = () => {
    const [showMore, setShowMore] = useState(false);
    return (
        <div className="max-w-contentContainer mx-auto px-4 py-24">
            <div className="w-full flex flex-col items-center">
                <h2 className="text-3xl font-titleFont font-semibold">
                    Other Noteworthy Projects
                </h2>
                <p className="text-sm font-titleFont text-textGreen">
                    view the archive
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10 lgl:px-10">
                <ArchiveCard
                    title="GamesON 🧪"
                    des="A proto-type product for a early stage startup. Its an android application, build with on flutter to incorporate modern design and for testing UI"
                    link="https://github.com/abhishekkumar11724/gameson"
                    listItem={["Flutter", "Dart", "Firebase"]}
                />
                <ArchiveCard
                    title="Car Showroom (under-work ⚒️) "
                    des="A project to deliver models of cars into the hands of the Appreciator. The aim of this project was to use ThreeJS to add car models on website and make it customizable."
                    link="https://www.github.com/car-showroom"
                    listItem={["HTML", "CSS"]}
                />
                <ArchiveCard
                    title="spaceStation Database Queries"
                    des="Its a bunch of Queries, for the Database of Space station(totally Imaginary). Mainly it was build, for another project but that never happened 🥲"
                    link="https://github.com/abhishekkumar11724/ISS_management_system"
                    listItem={["Reactjs", "Tailwindcss", "getform.io"]}
                />

                {showMore && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <ArchiveCard
                                title="movie recommendation system"
                                des="This was an ML project was build for the recommending movies based on user preferences. Unfortunately, its build for Heroku hosting long time ago, and since than its on hold"
                                link="https://github.com/abhishekkumar11724/movie-recommendation-sys-101"
                                listItem={[
                                    "Python",
                                    "streamlit",
                                    "Jupiter",
                                ]}
                            />
                        </motion.div>
                        {/* <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <ArchiveCard
                                title="Educare English Learning Academy"
                                des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Est amet magni repellendus quod veritatis! Laudantium numquam vitae voluptatem voluptatum a!"
                                link="https://www.github.com"
                                listItem={[
                                    "Reactjs",
                                    "Tailwindcss",
                                    "getform.io",
                                ]}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <ArchiveCard
                                title="Educare English Learning Academy"
                                des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Est amet magni repellendus quod veritatis! Laudantium numquam vitae voluptatem voluptatum a!"
                                link="https://www.github.com"
                                listItem={[
                                    "Reactjs",
                                    "Tailwindcss",
                                    "getform.io",
                                ]}
                            />
                        </motion.div> */}
                    </>
                )}
            </div>
            <div className="mt-12 flex items-center justify-center">
                {showMore ? (
                    <button
                        onClick={() => setShowMore(false)}
                        className="w-36 h-12 rounded-md text-textGreen text-[13px] border border-textGreen hover:bg-hoverColor duration-300"
                    >
                        show Less
                    </button>
                ) : (
                    <button
                        onClick={() => setShowMore(true)}
                        className="w-36 h-12 rounded-md text-textGreen text-[13px] border border-textGreen hover:bg-hoverColor duration-300"
                    >
                        show More
                    </button>
                )}
            </div>
        </div>
    );
};

export default Archive;
