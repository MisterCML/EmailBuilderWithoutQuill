import React, { useMemo } from 'react';
import { useDroppable, useDndContext } from '@dnd-kit/core';

interface SectionDropZoneProps {
  position: number;
  isFirst?: boolean;
  isLast?: boolean;
}

export const SectionDropZone: React.FC<SectionDropZoneProps> = ({ 
  position, 
  isFirst = false,
  isLast = false 
}) => {
  const { active, over } = useDndContext();
  const dropZoneId = `section-drop-${position}`;
  
  const { setNodeRef } = useDroppable({
    id: dropZoneId,
    data: {
      accepts: ['layout'],
      position,
      type: 'section-drop-zone'
    },
  });

  // 使用 useMemo 稳定状态判断，通过 over.id 匹配来避免频繁闪烁
  const displayState = useMemo(() => {
    const isDraggingLayout = active?.data.current?.type === 'new-layout';
    // 使用 over?.id 匹配而不是 isOver，更稳定
    const isOverThisZone = isDraggingLayout && over?.id === dropZoneId;
    
    return {
      isDraggingLayout,
      shouldShow: isOverThisZone,
      height: isDraggingLayout ? (isOverThisZone ? '4px' : '8px') : '2px',
      zIndex: isOverThisZone ? 10 : 1,
    };
  }, [active?.data.current?.type, over?.id, dropZoneId]);

  return (
    <div
      ref={setNodeRef}
      style={{
        height: displayState.height,
        margin: isFirst ? '0' : '0',
        transition: 'height 0.2s ease',
        position: 'relative',
        zIndex: displayState.zIndex,
      }}
    >
      {displayState.shouldShow && (
        <div
          style={{
            height: '4px',
            background: '#0078d4',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(0, 120, 212, 0.5)',
            animation: 'pulse 1s ease-in-out infinite',
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
