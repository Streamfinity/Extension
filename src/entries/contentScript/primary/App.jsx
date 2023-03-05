import logo from '~/assets/logo.svg';
import './App.css';
import { createLogger } from '~/common/log';

const log = createLogger('Content-Script');

function App() {
    const logoImageUrl = new URL(logo, import.meta.url).href;

    log.debug('content script react');

    return (
        <div>
            ++++++++streamfinity+++++++++++
        </div>
    );
}

export default App;
