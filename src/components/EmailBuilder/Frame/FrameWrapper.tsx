import React, { useState, useCallback } from 'react';
import type { FrameType, ElementType } from '../../../types/email.types';
import { getToolbarButtons } from './toolbarConfig';
import { ElementPicker } from '../ElementPicker/ElementPicker';
import './Frame.css';

interface FrameWrapperProps {
  frameType: FrameType;
  isSelected: boolean;
  isHovered?: boolean;
  isParentHovered?: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  showAddButtons?: boolean;
  showPrependButton?: boolean;
  onAppend?: () => void;
  onPrepend?: () => void;
  onAppendElement?: (elementType: ElementType) => void; // 用于 element 的 append
  children: React.ReactNode;
  className?: string;
}

export const FrameWrapper: React.FC<FrameWrapperProps> = ({
  frameType,
  isSelected,
  isHovered = false,
  isParentHovered = false,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  showAddButtons = false,
  showPrependButton = false,
  onAppend,
  onPrepend,
  onAppendElement,
  children,
  className = '',
}) => {
  const [localHovered, setLocalHovered] = useState(false);
  const [childHovered, setChildHovered] = useState(false);
  const [showElementPicker, setShowElementPicker] = useState(false);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    // 检查事件是否来自子FrameWrapper
    const target = e.target as HTMLElement;
    const isChildFrame = target.classList.contains('inlineFrame') && target !== e.currentTarget;
    
    if (isChildFrame) {
      // 鼠标在子Frame上，当前Frame显示parent-hovered状态
      setChildHovered(true);
      setLocalHovered(false);
    } else {
      // 鼠标直接在当前Frame上
      setLocalHovered(true);
      setChildHovered(false);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setLocalHovered(false);
    setChildHovered(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  }, [onSelect]);

  const toolbarButtons = getToolbarButtons(
    onDelete,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown
  );

  const frameClassName = [
    'inlineFrame',
    isSelected && 'selected',
    (isHovered || localHovered) && !isSelected && 'hovered',
    (isParentHovered || childHovered) && !isSelected && !isHovered && !localHovered && 'parent-hovered',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={frameClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-frame-type={frameType}
    >
      {/* 编辑器UI层 - 仅在选中时显示 */}
      {isSelected && (
        <div className="inlineOverlay">
          {/* 工具栏 */}
          <div className="inlineToolbar">
            {toolbarButtons.map((button) => (
              <button
                key={button.id}
                className="toolbar-button"
                onClick={(e) => {
                  e.stopPropagation();
                  button.onClick();
                }}
                disabled={button.disabled}
                title={button.label}
              >
                {button.icon}
              </button>
            ))}
          </div>

          {/* 添加按钮 */}
          {showAddButtons && (
            <>
              {showPrependButton && onPrepend && (
                <button
                  className={`add-button add-button-prepend add-button-${frameType}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrepend();
                  }}
                  title="Prepend Section"
                >
                  +
                </button>
              )}
              {(onAppend || onAppendElement) && (
                <button
                  className={`add-button add-button-append add-button-${frameType}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // 如果是 element 类型且有 onAppendElement，显示元素选择弹窗
                    if (frameType === 'element' && onAppendElement) {
                      setShowElementPicker(true);
                    } else if (onAppend) {
                      // 否则直接调用 onAppend（section 类型）
                      onAppend();
                    }
                  }}
                  title={frameType === 'element' ? 'Add Element' : 'Append Section'}
                >
                  +
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* 元素选择弹窗 */}
      {showElementPicker && onAppendElement && (
        <ElementPicker
          isOpen={showElementPicker}
          onClose={() => setShowElementPicker(false)}
          onSelect={onAppendElement}
          title="Select Element"
        />
      )}

      {/* 内容层 */}
      <div className="inlineContent">
        {children}
      </div>
    </div>
  );
};
