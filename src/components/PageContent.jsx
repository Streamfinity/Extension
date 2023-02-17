import { useState } from 'react';
import './PageContent.css';
import logo from '~/assets/logo.svg';
import { childrenShape } from '~/shapes';

function PageContent({ children }) {
    const imageUrl = new URL(logo, import.meta.url).href;

    const [count, setCount] = useState(0);

    return (
        <div>
            <img
                src={imageUrl}
                height="45"
                alt=""
            />
            <h1>{children}</h1>
            <button
                type="button"
                onClick={() => setCount((c) => c + 1)}
            >
                Count:
                {' '}
                {count}
            </button>
        </div>
    );
}

PageContent.propTypes = {
    children: childrenShape.isRequired,
};

export default PageContent;
