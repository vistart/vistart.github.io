/**
 * 工具配置接口
 */
export interface ToolConfig {
    /** 工具唯一标识 */
    id: string;
    /** 工具名称的国际化键 */
    nameKey: string;
    /** 工具描述的国际化键 */
    descriptionKey: string;
    /** 工具图标 (Element Plus 图标名称) */
    icon: string;
    /** 工具组件 (懒加载) */
    component: () => Promise<any>;
    /** 是否在首页显示 */
    showInHome?: boolean;
    /** 工具标签 */
    tags?: string[];
    /** 工具版本 */
    version?: string;
    /** 工具自身的国际化消息 */
    messages?: Record<string, Record<string, any>>;
    /** 获取工具国际化消息的方法 */
    getMessages?: () => Promise<Record<string, Record<string, any>>>;
}

/**
 * 工具参数接口
 */
export interface ToolParams {
    [key: string]: any;
}

/**
 * 工具结果接口
 */
export interface ToolResult {
    [key: string]: any;
}