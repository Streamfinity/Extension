import PropTypes from 'prop-types';

/**
 * Defines the shape of children prop.
 * @type {import('prop-types').Requireable<import('react').ReactNodeLike>}
 */
export const childrenShape = PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
]);

/**
 * Defines the shape of style prop.
 * @type {import('prop-types').Requireable<Record<string, string>>}
 */
export const styleShape = PropTypes.objectOf(PropTypes.string);
