module.exports = {
    root: true,
    env: {
        node: true,
        webextensions: true,
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
    extends: [
        'plugin:react/recommended',
        'plugin:import/recommended',
        'airbnb',
        'plugin:tailwindcss/recommended',
    ],
    plugins: [
        'react',
        'import',
        'only-warn',
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
        'no-unused-vars': ['warn'],
        'no-undef': 'off',
        'jsx-a11y/no-autofocus': 'off',
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
        'react/react-in-jsx-scope': 'off',
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off', // TODO enable
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/control-has-associated-label': 'off',
    },
    settings: {
        'import/resolver': {
            alias: {
                extensions: ['.js', '.jsx'],
                map: [
                    ['@', '.'],
                ],
            },
        },
    },
};
