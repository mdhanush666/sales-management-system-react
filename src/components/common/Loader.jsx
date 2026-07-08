import React from "react";

const Loader = ({ message = "fetching data..", fullscreen = false }) => {
    return (
        <div
            className={`flex flex-col gap-4 items-center justify-center ${fullscreen ? "h-screen w-full" : ""
                }`}
        >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-950"></div>
            {message}
        </div>
    );
};

export default Loader;