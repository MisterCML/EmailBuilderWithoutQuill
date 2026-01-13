import React, { useRef, useEffect } from 'react';
import type { EmailElement } from '../../../types/email.types';
import './TextElement.css';

interface TextElementProps {
  element: EmailElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<EmailElement>) => void;
}

export const TextElement: React.FC<TextElementProps> = ({ 
  element, 
  isSelected, 
  onUpdate
}) => {
  const content = element.content as { html: string };
  const editorRef = useRef<HTMLDivElement>(null);

  // 当选中时自动聚焦
  useEffect(() => {
    if (isSelected && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isSelected]);

  // 处理内容变化
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onUpdate({
        content: { ...content, html },
      });
    }
  };

  // 处理粘贴事件，清理格式
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  if (!isSelected) {
    // 未选中时，显示为只读的 div
    return (
      <div
        className="text-element text-element-readonly"
        style={element.styles}
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    );
  }

  // 选中时，使用 contentEditable
  return (
    <div
      ref={editorRef}
      className="text-element text-element-editable"
      style={element.styles}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onPaste={handlePaste}
      dangerouslySetInnerHTML={{ __html: content.html }}
    />
  );
};
