module.exports = {
    root: true,
    env: {
        node: true,
        webextensions: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'react-app',
    ],
    plugins: [
        'react',
        'import',
    ],
    ignorePatterns: [
        'dist/**/*',
        'public/**/*',
    ],
    rules: {
        indent: ['error', 4],
        'max-len': 'off',
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
        'react/react-in-jsx-scope': 'off',
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
    },
};
