export const AI_MODELS = {
    DEEPSEEK: 'deepseek/deepseek-chat-v3-0324:free',
    ALLEN: 'allenai/molmo-7b-d:free',
    GEMINI: 'google/gemini-2.0-pro-exp-02-05:free',
} as const;

export const MODEL_DETAILS = [
    {
        id: 'deepseek',
        name: 'Deepseek V3',
        model: AI_MODELS.DEEPSEEK,
        icon: '/deepseek.png',
        description: 'Most advanced model for code generation and UI analysis',
        badge: 'Recommended'
    },
    {
        id: 'allen',
        name: 'Allen Molmo',
        model: AI_MODELS.ALLEN,
        icon: '/meta.png',
        description: 'Most advanced model for code generation and UI analysis',
        badge: 'Creative'
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        model: AI_MODELS.GEMINI,
        icon: '/google.png',
        description: 'Most advanced model for code generation and UI analysis',
        badge: 'Recommended'
    },
];