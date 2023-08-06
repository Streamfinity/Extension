import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape } from '~/shapes';

function H3Header({
    children, mt, mb, step,
}) {
    return (
        <h3 className={classNames(mt, mb, 'flex items-center text-2xl font-semibold')}>
            {step !== null && (
                <div className="h-7 w-7 mr-3 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-base">
                    {step}
                </div>
            )}
            {children}
        </h3>
    );
}

H3Header.propTypes = {
    children: childrenShape.isRequired,
    mt: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    mb: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    step: PropTypes.number,
};

H3Header.defaultProps = {
    mt: 'mt-6',
    mb: 'mb-4',
    step: null,
};

export default H3Header;
