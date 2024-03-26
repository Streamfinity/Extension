import React from 'react';
import PropTypes from 'prop-types';
import TwitchIcon from '~/components/Icons/Twitch';
import YouTubeIcon from '~/components/Icons/Youtube';
import { accountServices } from '~/enums';

function ServiceIcon({ service, size, className }) {
    if (service.id === accountServices.TWITCH) {
        return (
            <TwitchIcon
                height={size}
                width={size}
                className={className}
            />
        );
    }

    if (service.id === accountServices.YOUTUBE) {
        return (
            <YouTubeIcon
                height={size}
                width={size}
                className={className}
            />
        );
    }

    return null;
}

ServiceIcon.propTypes = {
    className: PropTypes.string,
    size: PropTypes.number,
    service: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
    }).isRequired,
};

ServiceIcon.defaultProps = {
    className: null,
    size: 16,
};

export default ServiceIcon;
