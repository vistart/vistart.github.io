import { createI18n } from 'vue-i18n';
import zhCN from './zh-CN';

type MessageSchema = typeof zhCN;

const i18n = createI18n<[MessageSchema], 'zh-CN'>({
    legacy: false,
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    messages: {
        'zh-CN': zhCN,
    },
});

// 获取当前语言
export const getCurrentLanguage = () => {
    return i18n.global.locale;
};

// 获取可用语言列表
export const getAvailableLanguages = () => {
    return ['zh-CN'];
};

export default i18n;