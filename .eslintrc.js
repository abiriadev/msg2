module.exports = {
    env: {
        // "browser": true,
        commonjs: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'eslint-config-airbnb-base',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'no-console': 'off',
        'import/prefer-default-export': 'off',
        'no-await-in-loop': 'off',
        'no-unused-vars': 1,
        'lines-between-class-members': 'off',
        'no-shadow': 0,
    },
}
