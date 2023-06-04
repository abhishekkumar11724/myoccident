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
                Front-end developer{" "}
                <span className="text-textGreen tracking-wider">@Digencial</span>
            </h3>
            <p className="text-sm mt-1 font-medium text-textDark">
                Feb 2022 
            </p>
            <ul className="mt-6 flex flex-col gap-3">
                <li className="text-base flex gap-2 text-textDark">
                    <span className="text-textGreen mt-1">
                        <TiArrowForward />
                    </span>
                    Write modern and maintainable code for a client looking for
                    starting a small service business.
                </li>
                <li className="text-base flex gap-2 text-textDark">
                    <span className="text-textGreen mt-1">
                        <TiArrowForward />
                    </span>
                    work with reactJS, custom CSS, and JS(ES6+)
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
