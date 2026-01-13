/**
 * 邮件元素类型定义
 */
// 元素类型
export type ElementType = 'text' | 'image' | 'button' | 'divider' | 'qrcode' | 'customcode';

// 邮件元素
export interface EmailElement {
  id: string;
  type: ElementType;
  content: any;  // 元素的内容（文本、图片URL、按钮文字等）
  styles: Record<string, any>;  // 样式配置
}

// Section布局类型
export type LayoutType = 'single' | 'two-equal' | 'two-left' | 'two-right' | 'three';

// 邮件Section
export interface EmailSection {
  id: string;
  columns: EmailElement[][];  // 列数组，每列包含多个元素
  columnWidths?: string[];    // 列宽配置（如：['50%', '50%']）
  styles?: {                  // Section样式
    backgroundColor?: string;
    padding?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
  };
}

// 全局邮件样式（对应微软的设计）
export interface GlobalStyles {
  layoutMaxWidth?: string;      // 默认600px
  fontFamily?: string;          // 默认Arial, Verdana, sans-serif
  bodyTextSize?: string;        // 默认14px
  bodyTextColor?: string;       // 默认#000
  outerBackground?: string;     // 默认#FFFFFF
}

// 邮件数据
export interface EmailData {
  sections: EmailSection[];     // 所有 section
  subject?: string;             // 邮件主题
  globalStyles?: GlobalStyles;  // 全局样式
}

// Frame类型（用于FrameWrapper）
export type FrameType = 'section' | 'column' | 'element';

// 工具栏按钮配置
export interface ToolbarButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// 文本元素内容
export interface TextContent {
  html: string;  // HTML内容
}

// 图片元素内容
export interface ImageContent {
  src?: string;  // 可选，如果没有src则显示placeholder
  alt?: string;
  width?: string;
  height?: string;
  link?: string;
  align?: 'left' | 'center' | 'right';  // 水平对齐方式
}

// 按钮元素内容
export interface ButtonContent {
  text: string;
  link: string;
}

// 分隔线元素内容
export interface DividerContent {
  color?: string;
  width?: string;
  height?: string;
}
