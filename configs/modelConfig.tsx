export const AI_MODELS = {
    QWQ: 'qwen/qwen2.5-vl-3b-instruct:free',
    ALLEN: 'allenai/molmo-7b-d:free',
    GEMINI: 'qwen/qwen2.5-vl-32b-instruct:free',
} as const;

export const MODEL_DETAILS = [
    {
        id: 'qwen',
        name: 'Qwen',
        model: AI_MODELS.QWQ,
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