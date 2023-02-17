import PropTypes from 'prop-types';

export const childrenShape = PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
]);

export const styleShape = PropTypes.objectOf(PropTypes.string);
