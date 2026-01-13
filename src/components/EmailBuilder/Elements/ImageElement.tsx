import React, { useRef, useState, useCallback } from 'react';
import type { EmailElement, ImageContent } from '../../../types/email.types';
import './ImageElement.css';

interface ImageElementProps {
  element: EmailElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<EmailElement>) => void;
}

export const ImageElement: React.FC<ImageElementProps> = ({ element, isSelected, onUpdate }) => {
  const content = element.content as ImageContent;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<'right' | 'bottom' | 'corner' | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  const hasImage = content.src && content.src.trim() !== '';

  // 处理文件上传
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        onUpdate({
          content: {
            ...content,
            src,
            alt: file.name,
          },
        });
      };
      reader.readAsDataURL(file);
    }
    // 重置input，以便可以再次选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [content, onUpdate]);

  // 处理点击placeholder上传
  const handlePlaceholderClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 开始调整大小
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: 'right' | 'bottom' | 'corner') => {
    e.stopPropagation();
    if (!imageRef.current || !hasImage) return;
    
    setIsResizing(true);
    setResizeHandle(handle);
    
    const rect = imageRef.current.getBoundingClientRect();
    setStartPos({ x: e.clientX, y: e.clientY });
    
    const currentWidth = content.width || '100%';
    const currentHeight = content.height || 'auto';
    
    setStartSize({
      width: typeof currentWidth === 'string' && currentWidth.includes('%') 
        ? rect.width 
        : parseFloat(currentWidth) || rect.width,
      height: currentHeight === 'auto' 
        ? rect.height 
        : parseFloat(currentHeight) || rect.height,
    });
  }, [content, hasImage]);

  // 调整大小
  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeHandle || !imageRef.current) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    
    if (resizeHandle === 'right' || resizeHandle === 'corner') {
      newWidth = Math.max(50, startSize.width + deltaX);
    }
    
    if (resizeHandle === 'bottom' || resizeHandle === 'corner') {
      newHeight = Math.max(50, startSize.height + deltaY);
    }
    
    // 更新图片尺寸
    onUpdate({
      content: {
        ...content,
        width: `${newWidth}px`,
        height: resizeHandle === 'right' ? content.height : `${newHeight}px`,
      },
    });
  }, [isResizing, resizeHandle, startPos, startSize, content, onUpdate]);

  // 结束调整大小
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  // 监听鼠标移动和释放
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  // 计算对齐样式
  const getAlignmentStyle = () => {
    const align = content.align || 'center';
    return {
      textAlign: align,
    };
  };

  return (
    <div 
      ref={containerRef}
      className="image-element" 
      style={{ ...element.styles, ...getAlignmentStyle() }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      
      {!hasImage ? (
        // Placeholder区域
        <div 
          className="image-placeholder"
          onClick={handlePlaceholderClick}
        >
          <div className="placeholder-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>点击上传图片</p>
          </div>
        </div>
      ) : (
        // 图片显示区域
        <div className="image-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
          {content.link ? (
            <a href={content.link} target="_blank" rel="noopener noreferrer">
              <img
                ref={imageRef}
                src={content.src}
                alt={content.alt || 'Image'}
                style={{
                  width: content.width || '100%',
                  height: content.height || 'auto',
                  display: 'block',
                  maxWidth: '100%',
                }}
              />
            </a>
          ) : (
            <img
              ref={imageRef}
              src={content.src}
              alt={content.alt || 'Image'}
              style={{
                width: content.width || '100%',
                height: content.height || 'auto',
                display: 'block',
                maxWidth: '100%',
              }}
            />
          )}
          
          {/* 调整大小控制点 - 四个角的小方块 */}
          {isSelected && (
            <>
              <div
                className="resize-handle resize-handle-top-left"
                onMouseDown={(e) => handleResizeStart(e, 'corner')}
              />
              <div
                className="resize-handle resize-handle-top-right"
                onMouseDown={(e) => handleResizeStart(e, 'corner')}
              />
              <div
                className="resize-handle resize-handle-bottom-left"
                onMouseDown={(e) => handleResizeStart(e, 'corner')}
              />
              <div
                className="resize-handle resize-handle-bottom-right"
                onMouseDown={(e) => handleResizeStart(e, 'corner')}
              />
              {/* 四个边的控制条 */}
              <div
                className="resize-handle resize-handle-top"
                onMouseDown={(e) => handleResizeStart(e, 'bottom')}
              />
              <div
                className="resize-handle resize-handle-right"
                onMouseDown={(e) => handleResizeStart(e, 'right')}
              />
              <div
                className="resize-handle resize-handle-bottom"
                onMouseDown={(e) => handleResizeStart(e, 'bottom')}
              />
              <div
                className="resize-handle resize-handle-left"
                onMouseDown={(e) => handleResizeStart(e, 'right')}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
