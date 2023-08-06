import React from 'react';
import { childrenShape } from '~/shapes';

function Card({ children }) {
    return (
        <div className="p-4 bg-gray-700 rounded-md">
            {children}
        </div>
    );
}

Card.propTypes = {
    children: childrenShape.isRequired,
};

export default Card;
