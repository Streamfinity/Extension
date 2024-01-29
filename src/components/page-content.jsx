import { useState } from 'react';
import './page-content.css';
import logo from '~/assets/Logo-Dark.svg';
import { childrenShape } from '~/shapes';

/**
 * Renders the page content with a logo, title, and a counter button.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the component.
 * @returns {JSX.Element} The rendered page content.
 */
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
