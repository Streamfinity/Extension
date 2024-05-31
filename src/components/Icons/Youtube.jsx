// credits
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Function component for rendering a YouTube icon.
 * 
 * @param {Object} props - The props for the YouTube icon.
 * @param {string} props.className - The class name for the icon.
 * @param {number} props.height - The height of the icon.
 * @param {number} props.width - The width of the icon.
 * @param {string} props.viewBox - The viewBox for the icon.
 * @returns {JSX.Element} A div containing an SVG element representing the YouTube icon.
 */
function YouTubeIcon({
    className, height, width, viewBox,
}) {
    return (
        <div className={className}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                id="Layer_1"
                width={width}
                height={height}
                viewBox={viewBox}
                x="0"
                y="0"
                version="1.1"
            >
                <g
                    id="g5"
                    transform="scale(.58824)"
                >
                    <path
                        id="path7"
                        fill="currentColor"
                        fillOpacity="1"
                        d="M118.9 13.3c-1.4-5.2-5.5-9.3-10.7-10.7C98.7 0 60.7 0 60.7 0s-38 0-47.5 2.5C8.1 3.9 3.9 8.1 2.5 13.3 0 22.8 0 42.5 0 42.5s0 19.8 2.5 29.2C3.9 76.9 8 81 13.2 82.4 22.8 85 60.7 85 60.7 85s38 0 47.5-2.5c5.2-1.4 9.3-5.5 10.7-10.7 2.5-9.5 2.5-29.2 2.5-29.2s.1-19.8-2.5-29.3z"
                    />
                    <path
                        id="polygon9"
                        fill="#000"
                        d="M80.2 42.5 48.6 24.3v36.4z"
                        className="hidden dark:block"
                    />
                    <path
                        id="polygon10"
                        fill="#fff"
                        d="M80.2 42.5 48.6 24.3v36.4z"
                        className="block dark:hidden"
                    />
                </g>
            </svg>
        </div>
    );
}

YouTubeIcon.propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    viewBox: PropTypes.string,
};

YouTubeIcon.defaultProps = {
    className: null,
    height: 200,
    width: 200,
    viewBox: '0 0 71.412065 50',
};

export default YouTubeIcon;
