import React from 'react';
import PropTypes from 'prop-types';

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
