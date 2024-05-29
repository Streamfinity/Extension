import moment from 'moment';
import browser from 'webextension-polyfill';
import { storageGetUser } from '~/entries/background/common/storage';
import { getApiUrl } from '~/config';

/**
 * Returns the name of the browser based on the user agent string.
 * If the browser is not recognized, it returns 'unknown'.
 *
 * @returns {string} The name of the browser.
 */
function getBrowser() {
    if (!navigator?.userAgent) {
        return null;
    }
    if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
        return 'Opera';
    } if (navigator.userAgent.indexOf('Edg') !== -1) {
        return 'Edge';
    } if (navigator.userAgent.indexOf('Chrome') !== -1) {
        return 'Chrome';
    } if (navigator.userAgent.indexOf('Safari') !== -1) {
        return 'Safari';
    } if (navigator.userAgent.indexOf('Firefox') !== -1) {
        return 'Firefox';
    } if ((navigator.userAgent.indexOf('MSIE') !== -1) || (!!document.documentMode === true)) {
        return 'IE';
    }
    return 'unknown';
}

/**
 * Asynchronous function that retrieves the user data.
 * 
 * @returns {Promise} A promise that resolves with the user data if available, otherwise null.
 */
async function getUser() {
    if (typeof window !== 'undefined' && window.streamfinityUser) {
        return window.streamfinityUser;
    }

    if (typeof browser.storage !== 'undefined') {
        return storageGetUser();
    }

    return null;
}

const log = {
    enabled: true,
    section: null,
    app: 'EXT',
    appColor: '#0d9488',
    forwardCallback: null,
    levels: {
        verbose: {
            highlight: 'hsl(0, 0%, 46%)',
            levelNum: 100,
            levelName: 'VERBOSE',
            func: console.debug,
            debugOnly: true,
        },
        debug: {
            highlight: 'hsl(238, 100%, 70%)',
            levelNum: 200,
            levelName: 'DEBUG',
            func: console.log,
            debugOnly: true,
        },
        info: {
            highlight: 'hsl(199, 100%, 70%)',
            levelNum: 300,
            levelName: 'INFO',
            func: console.log,
            debugOnly: false,
        },
        warn: {
            highlight: 'hsl(24, 100%, 70%)',
            levelNum: 400,
            levelName: 'WARN',
            func: console.log,
            debugOnly: false,
        },
        error: {
            highlight: 'hsl(0, 100%, 70%)',
            levelNum: 500,
            levelName: 'ERROR',
            func: console.log,
            debugOnly: false,
        },
    },

    log(level, args) {
        if (!this.enabled) {
            return;
        }

        // ----------------------------- WIP -----------------------------
        getUser().then((user) => {
            if (user?.extension_log || level === 'error' || level === 'warn') {
                this.sendToLogging(level, user, args);
            }
        });
        // ----------------------------- WIP -----------------------------

        const { func, highlight } = this.levels[level];
        const placeholder = ' '.repeat(Math.max(0, 6 - level.length));

        if (this.forwardCallback) {
            this.forwardCallback(level, args);
        }

        func(...[
            `%c${moment().format('mm:ss.SSS')} %c ${this.app} %c ${level.toUpperCase()}${placeholder} %c ${this.section} `,
            'color:grey;font-family:monospace',
            `color:${this.appColor};font-family:monospace;font-weight:bold`,
            `background-color:${highlight};color:black;font-weight:bold`,
            `color:${highlight};font-weight:bold`,
            ...args,
        ]);
    },

    async sendToLogging(level, user, args) {
        const message = args.map((arg) => ((typeof arg === 'string') ? arg : JSON.stringify(arg))).join(', ');

        try {
            await fetch('https://logs.streamfinity.tv/loki/api/v1/push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    streams: [
                        {
                            stream: {
                                project: 'extension',
                                channel: 'beta',
                                env: 'beta',
                            },
                            values: [
                                [`${((+new Date()) * 1000000)}`, JSON.stringify({
                                    datetime: new Date().toISOString(),
                                    level: (this.levels[level]?.levelNum ?? 200),
                                    level_name: (this.levels[level]?.levelName ?? level.toUpperCase()),
                                    message,
                                    app: this.app,
                                    section: this.section,
                                    ep: getApiUrl(),
                                    ...(user ? { user: user.display_name } : {}),
                                    version: browser.runtime.getManifest()?.version,
                                    browser: getBrowser(),
                                })],
                            ],
                        },
                    ],
                }),
            });
        } catch (err) {
            console.log('----------- error sending log to logging -----------');
            console.log(message);
            console.error(err);
            console.error(err?.response);
        }
    },

    verbose(...args) {
        this.log('verbose', args);
    },
    debug(...args) {
        this.log('debug', args);
    },
    info(...args) {
        this.log('info', args);
    },
    warning(...args) {
        this.log('warn', args);
    },
    warn(...args) {
        this.warning(...args);
    },
    error(...args) {
        this.log('error', args);
    },
};

/**
 * Creates a logger instance with the specified section and options.
 * 
 * @param {string} section - The section name for the logger.
 * @param {Object} options - Additional options for the logger.
 * @param {Function} options.forwardCallback - A callback function to forward log messages.
 * @returns {Object} A logger instance with the specified section and options.
 */
export function createLogger(section, options = {}) {
    const logger = { ...log };
    logger.section = section;

    if (options.forwardCallback) {
        logger.forwardCallback = options.forwardCallback;
    }

    return logger;
}
