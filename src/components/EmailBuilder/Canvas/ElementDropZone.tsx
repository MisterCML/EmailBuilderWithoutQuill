import React, { useMemo } from 'react';
import { useDroppable, useDndContext } from '@dnd-kit/core';

interface ElementDropZoneProps {
  sectionId: string;
  columnIndex: number;
  position: number;
  isFirst?: boolean;
  isLast?: boolean;
}

export const ElementDropZone: React.FC<ElementDropZoneProps> = ({ 
  sectionId,
  columnIndex,
  position,
  isFirst = false,
  isLast = false 
}) => {
  const { active, over } = useDndContext();
  const dropZoneId = `element-drop-${sectionId}-col-${columnIndex}-pos-${position}`;
  
  const { setNodeRef, isOver } = useDroppable({
    id: dropZoneId,
    data: {
      accepts: ['element'],
      sectionId,
      columnIndex,
      position,
      type: 'element-drop-zone'
    },
  });

  // 使用 useMemo 稳定状态判断
  const displayState = useMemo(() => {
    const isDraggingElement = active?.data.current?.type === 'new-element';
    
    // 只使用 isOver 作为判断，这是 useDroppable 提供的准确碰撞检测状态
    // 当 isOver 为 true 时，说明鼠标确实在这个 drop zone 上
    const isOverThisZone = isDraggingElement && isOver;
    
    return {
      isDraggingElement,
      shouldShow: isOverThisZone,
      height: isDraggingElement ? (isOverThisZone ? '3px' : '10px') : '2px',
      zIndex: isOverThisZone ? 10 : 1,
    };
  }, [active?.data.current?.type, isOver]);

  return (
    <div
      ref={setNodeRef}
      style={{
        // 增加碰撞检测区域：使用更大的高度和 padding
        // 当拖拽 element 时，增加 drop zone 的高度以便更容易触发
        minHeight: displayState.isDraggingElement ? '12px' : '2px',
        height: displayState.height,
        margin: isFirst ? '0' : '5px 0',
        padding: displayState.isDraggingElement ? '4px 0' : '0',
        transition: 'all 0.15s ease',
        position: 'relative',
        zIndex: displayState.zIndex,
        // 确保有足够的碰撞检测区域
        boxSizing: 'border-box',
        // 确保 drop zone 可见（即使很小）以便碰撞检测
        display: 'block',
        width: '100%',
      }}
    >
      {displayState.shouldShow && (
        <div
          style={{
            height: '3px',
            background: '#0078d4',
            borderRadius: '2px',
            boxShadow: '0 0 6px rgba(0, 120, 212, 0.5)',
            animation: 'pulse 1s ease-in-out infinite',
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      )}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}
      </style>
    </div>
  );
};
