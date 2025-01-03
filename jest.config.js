export default {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.json",
            },
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    globals: {
        "ts-jest": {
            isolatedModules: true,
        },
    },
};
