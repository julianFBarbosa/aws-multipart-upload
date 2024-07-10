import globals from "globals";


export default [
    {
        languageOptions: { globals: globals.browser },
        rules: [
            {
                "space-in-brackets": ["error", "always"],
                "space-in-parens": ["error", "never"],
            }
        ]
    },
];
