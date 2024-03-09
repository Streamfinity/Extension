import RefreshRuntime from 'react-refresh';

if (import.meta.hot) {
    RefreshRuntime.injectIntoGlobalHook(window);
    window.$RefreshReg$ = (type, id) => {
        RefreshRuntime.register(type, id);
    };
    window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
    window.__vite_plugin_react_preamble_installed__ = true;
}
