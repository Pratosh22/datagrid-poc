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
const CloseSVG = ({ size = 16, color, extraClass, onClick }) => {
    return (
      <svg
        width={size}
        height={size}
        className={extraClass}
        onClick={onClick}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M5 5L19 19"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 5L5 19"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  };

  const BarChartSVG = ({ size = 20 }) => {
    return (
        <svg className="pointer--none" width="34" height="34" viewBox="0 0 41 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                opacity="0.6"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7586 0.0427246H0.630859V30.0427H10.7586V0.0427246ZM25.5706 5.5918H15.4429V30.0428H25.5706V5.5918ZM40.2791 12.4817H30.1514V29.9327H40.2791V12.4817Z"
                fill="#0052CC"
            ></path>
        </svg>
    );
};

const LineChartSVG = ({ size = 20 }) => {
    return (
        <svg className="pointer--none" width="34" height="34" viewBox="0 0 70 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.6">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M55.7314 26.4768C55.051 26.0453 54.3635 25.6118 53.6846 25.1868L50.3429 26.6424C50.758 26.8982 51.1852 27.1631 51.6208 27.4348C51.8807 27.5969 52.1425 27.7607 52.4053 27.9255L55.7314 26.4768ZM51.294 28.4096C51.2264 28.3674 51.159 28.3253 51.0916 28.2833C50.4428 27.8787 49.8169 27.4917 49.2249 27.1294L48.0233 27.6528L43.7468 24.7959C43.6677 24.8192 43.585 24.8445 43.4988 24.8718C42.8918 25.0641 42.1928 25.3292 41.4277 25.6519L47.8206 29.9226L51.294 28.4096ZM40.437 24.99C41.2478 24.6333 42.0074 24.3269 42.6879 24.0885L39.6519 22.0604C39.0073 22.3364 38.3435 22.6388 37.6752 22.9566C37.6204 22.9827 37.5656 23.0089 37.5106 23.0352L40.437 24.99ZM25.6097 25.9794L23.6536 28.4041L21.7454 27.5841L23.7015 25.1594L25.6097 25.9794ZM36.5462 22.3909L31.3209 18.9002L26.2618 25.1711L24.3536 24.3512L30.9119 16.2218L38.6639 21.4004C38.1945 21.6089 37.72 21.828 37.2457 22.0536C37.0137 22.1639 36.7803 22.2765 36.5462 22.3909ZM6.86624 28.5802L2.91068 27.6528L2.60023 29.6285L4.41157 30.0438L6.86624 28.5802ZM10.0531 31.3371L5.82196 30.3671L8.26779 28.9088L12.4724 29.8946L10.0531 31.3371ZM11.4635 31.6604L19.534 33.5105L23.0016 29.2123L21.0934 28.3923L18.7029 31.3554L13.8739 30.2232L11.4635 31.6604ZM54.7953 24.703C55.4773 25.1317 56.1634 25.5658 56.8378 25.9948L63.5975 23.0504L62.7988 21.2168L54.7953 24.703Z"
                    fill="#0052CC"
                ></path>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M68.8215 26.4561L60.9043 33.384L59.952 32.7613C57.8736 31.4023 54.6207 29.3057 51.6207 27.4347C48.6026 25.5525 45.9891 23.994 45.0068 23.5604C44.9854 23.5589 44.8694 23.545 44.6115 23.5772C44.2595 23.621 43.7868 23.7316 43.1968 23.9185C42.0205 24.2911 40.5518 24.9105 38.9637 25.6658C35.797 27.1719 32.3234 29.1375 30.0944 30.4879L29.4342 30.8879L18.6082 26.2361L3.64861 35.1557L2.11225 32.5789L18.3864 22.8756L29.2037 27.5236C31.4794 26.1697 34.6927 24.3751 37.6751 22.9566C39.3132 22.1775 40.9238 21.4915 42.2909 21.0585C42.9725 20.8426 43.6374 20.6753 44.2405 20.6002C44.8003 20.5304 45.5106 20.5114 46.1523 20.7871C47.3656 21.3085 50.2441 23.0406 53.2083 24.8892C55.8039 26.508 58.5827 28.2915 60.6401 29.6288L66.8459 24.1984L68.8215 26.4561Z"
                    fill="#0052CC"
                ></path>
            </g>
        </svg>
    );
}

const PieChartSVG = ({ size = 20 }) => {
    return (
        <svg className="pointer--none" width="34" height="34" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.6">
                <path
                    id="Subtract"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.75 0.0205078C5.64301 0.409669 0 6.29585 0 13.5C0 18.6171 2.84693 23.0691 7.04327 25.3588L12.75 13.2206V0.0205078ZM13.8 14.5127L8.39805 26.0027C9.97209 26.6457 11.6947 27 13.5 27C20.4004 27 26.0917 21.8228 26.9013 15.1408L13.8 14.5127ZM27 13.5C27 13.548 26.9998 13.5959 26.9993 13.6438L14.25 13.0325V0.0205078C21.357 0.40967 27 6.29585 27 13.5Z"
                    fill="#0052CC"
                ></path>
            </g>
        </svg>
    );
}

const WordCloudSVG = (props) => {
    const { width = 54, height = 34 } = props;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 54 35" fill="none">
        <g opacity="0.6">
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="4.04405" fontWeight="600" letterSpacing="0em"><tspan x="5.23352" y="6.07645">Brand</tspan></text>
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="4.28194" fontWeight="600" letterSpacing="0em"><tspan x="19.0308" y="33.2799">Strategy</tspan></text>
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="6.42291" fontWeight="600" letterSpacing="0em"><tspan x="17.3657" y="6.3274">Cloud</tspan></text>
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="6.89868" fontWeight="600" letterSpacing="0em"><tspan x="31.163" y="21.4833">Widget</tspan></text>
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="8.08811" fontWeight="600" letterSpacing="0em"><tspan x="31.163" y="14.6506">Digital</tspan></text>
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="8.80176" fontWeight="600" letterSpacing="0em"><tspan x="3.56824" y="28.4638">Marketing</tspan></text>
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="5.47137" fontWeight="600" letterSpacing="0em"><tspan x="34.7312" y="6.34595">Media</tspan></text>
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="5.23348" fontWeight="600" letterSpacing="0em"><tspan x="0" y="21.3672">Management</tspan></text>
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="7.13656" fontWeight="600" letterSpacing="0em"><tspan x="1.42731" y="14.6692">IT</tspan></text>
          <text fill="#457FFD" style={{ whiteSpace: 'pre' }} fontFamily="Source Sans Pro" fontSize="12.6079" fontWeight="600" letterSpacing="0em"><tspan x="7.85022" y="16.7332">SEO</tspan></text>
        </g>
      </svg>
    );
  };

const BackSVG = ({ size = 16, color, extraClass, onClick }) => {
    return (
      <svg
        width={size}
        height={size}
        className={extraClass}
        viewBox="0 0 15 15"
        fill="none"
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.1112 7.00004C1.1112 6.63185 1.40973 6.33337 1.77786 6.33337H14.2224C14.5906 6.33337 14.889 6.63185 14.889 7.00004C14.889 7.36823 14.5906 7.66671 14.2224 7.66671H1.77786C1.40973 7.66671 1.1112 7.36823 1.1112 7.00004Z"
          fill={color}
        />
        <path
          d="M8.49554 0.554071C8.74185 0.827746 8.71966 1.24927 8.44598 1.49557L2.31052 7.01745L8.46336 12.9652C8.72809 13.2211 8.73524 13.6431 8.47934 13.9078C8.22344 14.1726 7.8014 14.1798 7.53666 13.9238L0.869891 7.47937C0.737091 7.35089 0.663491 7.173 0.666691 6.98817C0.670024 6.80333 0.749891 6.62817 0.887358 6.50452L7.55404 0.504515C7.82772 0.25821 8.24924 0.280398 8.49554 0.554071Z"
          fill={color}
        />
      </svg>
    );
  };
  

export {
    CloseSVG,
    StarSVG,
    BackSVG,
    BarChartSVG,
    LineChartSVG,
    PieChartSVG,
    WordCloudSVG
}
