import type { ToolConfig } from '../types';

const config: ToolConfig = {
    id: 'credit-card-apr',
    nameKey: 'tools.creditCardApr.name',
    descriptionKey: 'tools.creditCardApr.description',
    icon: 'Calculator',
    component: () => import('./CreditCardApr.vue'),
    showInHome: true,
    tags: ['finance', 'calculator'],
    version: '1.0.0',
};

export default config;