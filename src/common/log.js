import moment from 'moment';

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

export function createLogger(section, options = {}) {
    const logger = { ...log };
    logger.section = section;

    if (options.forwardCallback) {
        logger.forwardCallback = options.forwardCallback;
    }

    return logger;
}
