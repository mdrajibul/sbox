module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    },
    testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts?$',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    collectCoverageFrom: ['src/**/*.ts', '!public'],
    coverageReporters: ['html', 'text'],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 80,
            lines: 70,
            statements: 80
        }
    }
};