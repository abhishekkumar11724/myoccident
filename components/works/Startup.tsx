import React from "react";
import { motion } from "framer-motion";
import { TiArrowForward } from "react-icons/ti";
const ReactBD = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full"
        >
            <h3 className="flex gap-1 font-medium text-xl font-titleFont">
                Product Developer{" "}
                <span className="text-textGreen tracking-wider">
                    @GamesON 
                </span>
            </h3>
            <p className="text-sm mt-1 font-medium text-textDark">
                Jan 2023 - Present
            </p>
            <ul className="mt-6 flex flex-col gap-3">
                <li className="text-base flex gap-2 text-textDark">
                    <span className="text-textGreen mt-1">
                        <TiArrowForward />
                    </span>
                    writing a modern flutter app for a early stage
                    startup, with few of my colleagues. A Startup dedicated 
                    towards sports Industry.
                </li>
                <li className="text-base flex gap-2 text-textDark">
                    <span className="text-textGreen mt-1">
                        <TiArrowForward />
                    </span>
                    work with a variety of different languages, platforms,
                    frameworks, such as
                    Flutter, Dart, Firebase, etc.
                </li>
                {/* <li className="text-base flex gap-2 text-textDark">
                    <span className="text-textGreen mt-1">
                        <TiArrowForward />
                    </span>
                    communicate with multi-disciplinary teams of engineers,
                    designers, producers, and clients on daily basis
                </li> */}
            </ul>
        </motion.div>
    );
};

export default ReactBD;
