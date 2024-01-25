/**
 * Enables hot module replacement (HMR) for development in a React application.
 * 
 * @module enableDevHmr
 * @requires react-refresh
 * 
 * @example
 * import RefreshRuntime from 'react-refresh';
 * 
 * if (import.meta.hot) {
 *     RefreshRuntime.injectIntoGlobalHook(window);
 *     window.$RefreshReg$ = () => {};
 *     window.$RefreshSig$ = () => (type) => type;
 *     window.__vite_plugin_react_preamble_installed__ = true;
 * }
 */
import RefreshRuntime from 'react-refresh';

if (import.meta.hot) {
    RefreshRuntime.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => (type) => type;
    window.__vite_plugin_react_preamble_installed__ = true;
}
