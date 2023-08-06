import React from 'react';
import { childrenShape } from '~/shapes';

function H2Header({ children }) {
    return (
        <div className="mb-4 mt-6 text-3xl font-semibold">
            {children}
        </div>
    );
}

H2Header.propTypes = {
    children: childrenShape.isRequired,
};

H2Header.defaultProps = {};

export default H2Header;
