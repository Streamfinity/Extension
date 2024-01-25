import moment from 'moment';

/**
 * Represents a logging utility with different log levels.
 * @namespace log
 */
const log = {
    enabled: true,
    section: null,
    app: 'EXT',
    appColor: '#0d9488',
    forwardCallback: null,

    levels: {
        verbose: {
            highlight: 'hsl(0, 0%, 46%)',
            func: console.debug,
            debugOnly: true,
        },
        debug: {
            highlight: 'hsl(238, 100%, 70%)',
            func: console.log,
            debugOnly: true,
        },
        info: {
            highlight: 'hsl(199, 100%, 70%)',
            func: console.log,
            debugOnly: false,
        },
        warn: {
            highlight: 'hsl(24, 100%, 70%)',
            func: console.log,
            debugOnly: false,
        },
        error: {
            highlight: 'hsl(0, 100%, 70%)',
            func: console.log,
            debugOnly: false,
        },
    },

    /**
     * Logs a message with the specified log level.
     *
     * @param {string} level - The log level.
     * @param {Array} args - The arguments to be logged.
     */
    log(level, args) {
        if (!this.enabled) {
            return;
        }

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
 * Creates a logger with the specified section and options.
 * @param {string} section - The section name for the logger.
 * @param {Object} options - The options for the logger.
 * @param {Function} options.forwardCallback - The callback function to forward log messages.
 * @returns {Object} The created logger object.
 */
export function createLogger(section, options = {}) {
    const logger = { ...log };
    logger.section = section;

    if (options.forwardCallback) {
        logger.forwardCallback = options.forwardCallback;
    }

    return logger;
}
