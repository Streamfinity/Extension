import React from 'react';
import PropTypes from 'prop-types';
import { childrenShape } from '~/shapes';
import H2Header from '~/entries/contentScript/primary/components/h2-header';

/**
 * Renders an overlay component with a title, content, and a close button.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the overlay.
 * @param {Function} props.onHide - The function to be called when the overlay is closed.
 * @param {string} props.title - The title of the overlay.
 * @returns {JSX.Element} The rendered overlay component.
 */
function Overlay({ children, onHide, title }) {
    return (
        <div className="absolute left-0 top-0 w-full h-full z-20 p-10 rounded-[10px] overflow-hidden backdrop-blur bg-gray-300/30 dark:bg-black/30">
            <div className="w-full h-full rounded-lg bg-white dark:bg-gray-700 p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <H2Header
                        mt={false}
                        mb={false}
                    >
                        {title}
                    </H2Header>
                    <button
                        type="button"
                        onClick={onHide}
                    >
                        <svg
                            fill="currentColor"
                            height="12px"
                            width="12px"
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 460.775 460.775"
                            xmlSpace="preserve"
                        >
                            <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

Overlay.propTypes = {
    children: childrenShape.isRequired,
    onHide: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

Overlay.defaultProps = {};

export default Overlay;
