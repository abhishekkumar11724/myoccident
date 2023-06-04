import React from "react";
import { TbBrandGithub } from "react-icons/tb";
import {} from "react-icons/sl";
import {
    SlSocialYoutube,
    SlSocialLinkedin,
    SlSocialFacebook,
    SlSocialInstagram,
} from "react-icons/sl";
const Footer = () => {
    return (
        <div className="hidden mdl:inline-flex xl:hidden items-center justify-center w-full py-6 gap-4">
            <a href="" target="_blank">
                <span className="w-10 h-10 text-xl bg-bodyColor border-[1px] border-zinc-700 rounded-full inline-flex items-center justify-center hover:textGreen cursor-pointer hover:-translate-y-2 transition-all duration-300 ">
                    <TbBrandGithub />
                </span>
            </a>

            <a href="" target="_blank">
                <span className="w-10 h-10 text-xl bg-bodyColor border-[1px] border-zinc-700 rounded-full inline-flex items-center justify-center hover:textGreen cursor-pointer hover:-translate-y-2 transition-all duration-300 ">
                    <SlSocialFacebook />
                </span>
            </a>
            <a href="" target="_blank">
                <span className="w-10 h-10 text-xl bg-bodyColor border-[1px] border-zinc-700 rounded-full inline-flex items-center justify-center hover:textGreen cursor-pointer hover:-translate-y-2 transition-all duration-300 ">
                    <SlSocialInstagram />
                </span>
            </a>
            <a href="" target="_blank">
                <span className="w-10 h-10 text-xl bg-bodyColor border-[1px] border-zinc-700 rounded-full inline-flex items-center justify-center hover:textGreen cursor-pointer hover:-translate-y-2 transition-all duration-300 ">
                    <SlSocialLinkedin />
                </span>
            </a>
            <a href="" target="_blank">
                <span className="w-10 h-10 text-xl bg-bodyColor border-[1px] border-zinc-700 rounded-full inline-flex items-center justify-center hover:textGreen cursor-pointer hover:-translate-y-2 transition-all duration-300 ">
                    <SlSocialYoutube />
                </span>
            </a>
        </div>
    );
};

export default Footer;
