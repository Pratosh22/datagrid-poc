/* eslint-disable react/prop-types */
import React from "react";

const StarSVG = ({ size=20 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 44 44">
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M21.108 2.09a.955.955 0 011.787 0l4.832 13.7h13.646a.955.955 0 01.62 1.68l-11.402 9.454 4.773 14.337a.955.955 0 01-1.47 1.07L22 33.606l-11.9 8.727a.955.955 0 01-1.464-1.071l4.773-14.337L2.004 17.47a.955.955 0 01.62-1.68h13.649l4.835-13.7z"
            ></path>
        </svg>
    );
};

export {
    StarSVG
}
