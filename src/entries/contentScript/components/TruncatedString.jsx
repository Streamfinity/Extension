import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { truncateString } from '~/common/pretty';

function TruncatedString({ value }) {
    const truncated = useMemo(() => truncateString(value, 100), [value]);

    return (
        <span className="group/tstr relative overflow-hidden">
            <span className="invisible group-hover/tstr:visible">{value}</span>
            <span className="visible absolute left-0 w-full overflow-hidden group-hover/tstr:invisible">{truncated}</span>
        </span>
    );
}

TruncatedString.propTypes = {
    value: PropTypes.string,
};

export default TruncatedString;
