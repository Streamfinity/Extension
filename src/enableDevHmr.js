/**
 * Injects React Refresh Runtime into the global hook if hot module replacement is enabled.
 * Sets up necessary global variables for React Refresh.
 */
import RefreshRuntime from '/@react-refresh';

if (import.meta.hot) {
    RefreshRuntime.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => (type) => type;
    window.__vite_plugin_react_preamble_installed__ = true;
}
