import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the info view component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object.
 * @returns {JSX.Element} The rendered info view component.
 */
function InfoView({ user }) {
    return (
        <div>
            info
        </div>
    );
}

InfoView.propTypes = {
    user: PropTypes.shape({
        display_name: PropTypes.string,
    }).isRequired,
};

export default InfoView;
