import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useEmail } from '../../../context/EmailContext';
import { SectionRenderer } from './SectionRenderer';
import { SectionDropZone } from './SectionDropZone';
import './EmailCanvas.css';

export const EmailCanvas: React.FC = () => {
  const { emailData, clearSelection } = useEmail();

  // 设置整个画布为可放置区域（用于接收 layout sections）
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: {
      accepts: ['layout'],
      position: emailData.sections.length, // 默认添加到末尾
    },
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  return (
    <div className="email-canvas" onClick={handleCanvasClick}>
      <div 
        ref={setNodeRef}
        className="canvas-inner" 
        data-layout="true"
        style={{
          backgroundColor: isOver && emailData.sections.length === 0 ? '#f0f8ff' : 'transparent',
          transition: 'background-color 0.2s',
        }}
      >
        {emailData.sections.length === 0 ? (
          <div className="empty-canvas">
            <p>Drag elements or layouts here to start building your email.</p>
          </div>
        ) : (
          <>
            {emailData.sections.map((section, index) => (
              <React.Fragment key={section.id}>
                {/* 在第一个 section 之前添加 drop zone */}
                {index === 0 && <SectionDropZone position={0} isFirst />}
                
                <SectionRenderer
                  section={section}
                  sectionIndex={index}
                  totalSections={emailData.sections.length}
                />
                
                {/* 在每个 section 之后添加 drop zone */}
                <SectionDropZone 
                  position={index + 1} 
                  isLast={index === emailData.sections.length - 1}
                />
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
