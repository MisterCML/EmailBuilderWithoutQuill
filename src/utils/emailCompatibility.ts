/**
 * 将 HTML 转换为邮件兼容格式
 * - 将 <div> 替换为 <p>
 * - 确保样式内联
 * - 移除不兼容的标签和属性
 */

export function convertToEmailCompatibleHTML(html: string): string {
  if (!html) return '<p></p>';

  // 创建临时容器
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 将 div 标签替换为 p 标签
  const divs = tempDiv.querySelectorAll('div');
  divs.forEach((div) => {
    const p = document.createElement('p');
    
    // 复制所有属性（除了不兼容的）
    Array.from(div.attributes).forEach((attr) => {
      if (attr.name !== 'class' && attr.name !== 'style') {
        p.setAttribute(attr.name, attr.value);
      }
    });
    
    // 复制样式
    if (div.getAttribute('style')) {
      p.setAttribute('style', div.getAttribute('style') || '');
    }
    
    // 复制内容
    p.innerHTML = div.innerHTML;
    
    // 替换
    div.parentNode?.replaceChild(p, div);
  });

  // 处理格式标签，转换为内联样式
  const processNode = (node: Node): void => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      
      // 处理颜色和背景色（使用 data-* 属性）
      const color = element.getAttribute('data-color');
      const bgColor = element.getAttribute('data-background');
      
      if (color || bgColor) {
        let style = element.getAttribute('style') || '';
        if (color) {
          style = `color: ${color}; ${style}`;
        }
        if (bgColor) {
          style = `background-color: ${bgColor}; ${style}`;
        }
        element.setAttribute('style', style);
        element.removeAttribute('data-color');
        element.removeAttribute('data-background');
      }
      
      // 递归处理子节点
      Array.from(element.childNodes).forEach(processNode);
    }
  };

  Array.from(tempDiv.childNodes).forEach(processNode);

  // 如果没有任何内容，返回空的 p 标签
  if (tempDiv.children.length === 0 && !tempDiv.textContent?.trim()) {
    return '<p></p>';
  }

  return tempDiv.innerHTML;
}
