import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useEmail } from '../../../context/EmailContext';
import type { EmailSection, EmailElement } from '../../../types/email.types';
import { FrameWrapper } from '../Frame/FrameWrapper';
import { ElementRenderer } from '../Elements/ElementRenderer';
import { ElementDropZone } from './ElementDropZone';

interface ColumnWrapperProps {
  section: EmailSection;
  columnIndex: number;
  elements: EmailElement[];
}

export const ColumnWrapper: React.FC<ColumnWrapperProps> = ({ section, columnIndex, elements }) => {
  const {
    selectedColumnId,
    hoveredColumnId,
    selectColumn,
    updateElement,
    deleteElement,
    moveElementUp,
    moveElementDown,
    selectedElementId,
    selectElement,
    addElement,
  } = useEmail();

  const columnId = `${section.id}-col-${columnIndex}`;
  const isSelected = selectedColumnId === columnId;
  const isHovered = hoveredColumnId === columnId;

  // 设置为可放置区域
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: {
      accepts: ['element'],
      sectionId: section.id,
      columnIndex,
    },
  });

  const handleSelect = () => {
    selectColumn(section.id, columnIndex);
  };

  const handleDelete = () => {
    // Column 删除逻辑待实现
    console.log('Delete column', columnId);
  };

  return (
    <th 
      data-container="true" 
      className="columnContainer" 
      role="presentation" 
      style={{ verticalAlign: 'top', width: section.columnWidths?.[columnIndex] || '100%' }}
    >
      <FrameWrapper
        frameType="column"
        isSelected={isSelected}
        isHovered={isHovered}
        onSelect={handleSelect}
        onDelete={handleDelete}
      >
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
          <tbody>
            <tr>
              <th
                ref={setNodeRef}
                className="columnContainer inner"
                role="presentation"
                style={{ 
                  verticalAlign: 'top', 
                  padding: '10px',
                  backgroundColor: isOver ? '#f0f8ff' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                {elements.length === 0 ? (
                  <div style={{ 
                    minHeight: '50px', 
                    textAlign: 'center', 
                    color: isOver ? '#0078d4' : '#999', 
                    padding: '20px',
                    border: isOver ? '2px dashed #0078d4' : '1px dashed #d0d0d0',
                    backgroundColor: isOver ? 'transparent' : '#f5f5f5',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    fontSize: '12px',
                    fontWeight: 'normal'
                  }}>
                    {isOver ? 'Drop element here' : 'Add element here'}
                  </div>
                ) : (
                  <>
                    {elements.map((element, elementIndex) => (
                      <React.Fragment key={element.id}>
                        {/* 在第一个元素之前添加 drop zone */}
                        {elementIndex === 0 && (
                          <ElementDropZone 
                            sectionId={section.id}
                            columnIndex={columnIndex}
                            position={0}
                            isFirst
                          />
                        )}
                        
                        <FrameWrapper
                          frameType="element"
                          isSelected={selectedElementId === element.id}
                          onSelect={() => selectElement(element.id)}
                          onDelete={() => deleteElement(element.id)}
                          onMoveUp={() => moveElementUp(element.id)}
                          onMoveDown={() => moveElementDown(element.id)}
                          canMoveUp={elementIndex > 0}
                          canMoveDown={elementIndex < elements.length - 1}
                          showAddButtons={selectedElementId === element.id}
                          onAppendElement={(elementType) => {
                            // 在当前 element 之后添加指定类型的 element
                            addElement(section.id, columnIndex, elementType, elementIndex + 1);
                          }}
                        >
                          <ElementRenderer
                            element={element}
                            isSelected={selectedElementId === element.id}
                            onUpdate={(updates) => updateElement(element.id, updates)}
                          />
                        </FrameWrapper>
                        
                        {/* 在每个元素之后添加 drop zone */}
                        <ElementDropZone 
                          sectionId={section.id}
                          columnIndex={columnIndex}
                          position={elementIndex + 1}
                          isLast={elementIndex === elements.length - 1}
                        />
                      </React.Fragment>
                    ))}
                  </>
                )}
              </th>
            </tr>
          </tbody>
        </table>
      </FrameWrapper>
    </th>
  );
};
