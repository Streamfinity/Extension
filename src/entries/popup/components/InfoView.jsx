import React from 'react';
import PropTypes from 'prop-types';

function InfoView({ user, refreshStatus }) {
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
    refreshStatus: PropTypes.func.isRequired,
};

export default InfoView;
