import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape } from '~/shapes';

function H2Header({ children, mt }) {
    return (
        <div className={classNames(mt, 'mb-4 text-3xl font-semibold')}>
            {children}
        </div>
    );
}

H2Header.propTypes = {
    children: childrenShape.isRequired,
    mt: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
};

H2Header.defaultProps = {
    mt: 'mt-6',
};

export default H2Header;
