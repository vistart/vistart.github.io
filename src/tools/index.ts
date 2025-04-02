import type { ToolConfig } from './types';
import creditCardAprConfig from './credit-card-apr/config';

// 注册所有工具
const tools: ToolConfig[] = [
    creditCardAprConfig,
    // 在此处添加新工具
];

/**
 * 获取所有工具
 */
export const getAllTools = (): ToolConfig[] => {
    return tools;
};

/**
 * 根据ID获取工具
 */
export const getToolById = (id: string): ToolConfig | undefined => {
    return tools.find(tool => tool.id === id);
};

/**
 * 获取首页显示的工具
 */
export const getHomeTools = (): ToolConfig[] => {
    return tools.filter(tool => tool.showInHome !== false);
};

export type { ToolConfig };
export { tools };
