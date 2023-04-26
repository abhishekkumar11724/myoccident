import React from "react";
import { FaRegFolder } from "react-icons/fa";
import { RxOpenInNewWindow } from "react-icons/rx";

const ArchiveCard = () => {
    return (
        <div className="w-full h-80 rounded-lg bg-[#112240] p-7 flex flex-col justify-center gap-6 hover:translate-y-2 transition-transform duration-300 group">
            <div>
                <FaRegFolder />
                <RxOpenInNewWindow />
            </div>
        </div>
    );
};

export default ArchiveCard;
