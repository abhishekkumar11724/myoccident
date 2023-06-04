import React from "react";

const Contact = () => {
    return (
        <section
            id="contact"
            className="max-w-contentContainer mx-auto py-10 xl:py-32 flex flex-col gap-4 items-center justify-center"
        >
            <p className="font-titleFont text-lg text-textGreen font-semibold flex items-center tracking-wide">
                {" "}
                04. What&apos;s Next?{" "}
            </p>
            <h2 className="font-titleFont text-5xl font-semibold">
                Get In Touch
            </h2>
            <a href="mailto:abhisek.k.11724@gmail.com">
                <button className="w-40 h-14 border border-textGreen mt-6 font-titleFont text-sm text-textGreen tracking-wider rounded-md hover:bg-hoverColor duration-300">
                    Say Hello!
                </button>
            </a>
        </section>
    );
};

export default Contact;
