import React from 'react';
import { useEmail } from '../../context/EmailContext';
import type { ImageContent } from '../../types/email.types';
import './PropertiesPanel.css';

interface PropertiesPanelProps {
  selectedType?: 'element' | 'section' | 'column' | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedType }) => {
  const { selectedElementId, findElement, updateElement } = useEmail();

  if (!selectedType) {
    return (
      <div className="properties-panel">
        <div className="no-selection">
          <p>Select an element, section, or column to edit its properties.</p>
        </div>
      </div>
    );
  }

  // 如果是元素类型，获取元素信息
  const elementInfo = selectedType === 'element' && selectedElementId 
    ? findElement(selectedElementId) 
    : null;

  // 渲染图片元素的属性面板
  const renderImageProperties = () => {
    if (!elementInfo || elementInfo.element.type !== 'image') return null;
    
    const content = elementInfo.element.content as ImageContent;
    const align = content.align || 'center';

    const handleAlignChange = (newAlign: 'left' | 'center' | 'right') => {
      updateElement(elementInfo.element.id, {
        content: {
          ...content,
          align: newAlign,
        },
      });
    };

    return (
      <div className="properties-form">
        <div className="property-group">
          <label className="property-label">水平对齐</label>
          <div className="align-buttons">
            <button
              className={`align-button ${align === 'left' ? 'active' : ''}`}
              onClick={() => handleAlignChange('left')}
              title="左对齐"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="15" y2="6"/>
                <line x1="3" y1="18" x2="15" y2="18"/>
              </svg>
            </button>
            <button
              className={`align-button ${align === 'center' ? 'active' : ''}`}
              onClick={() => handleAlignChange('center')}
              title="居中"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="9" y1="6" x2="15" y2="6"/>
                <line x1="9" y1="18" x2="15" y2="18"/>
              </svg>
            </button>
            <button
              className={`align-button ${align === 'right' ? 'active' : ''}`}
              onClick={() => handleAlignChange('right')}
              title="右对齐"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="9" y1="6" x2="21" y2="6"/>
                <line x1="9" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 根据选中类型渲染不同的属性面板
  const renderProperties = () => {
    if (selectedType === 'element' && elementInfo) {
      if (elementInfo.element.type === 'image') {
        return renderImageProperties();
      }
      // 其他元素类型的属性面板可以在这里添加
      return (
        <div className="properties-form">
          <p>Property editor for {elementInfo.element.type} will be implemented here.</p>
        </div>
      );
    }

    if (selectedType === 'section') {
      return (
        <div className="properties-form">
          <p>Section properties will be implemented here.</p>
        </div>
      );
    }

    if (selectedType === 'column') {
      return (
        <div className="properties-form">
          <p>Column properties will be implemented here.</p>
        </div>
      );
    }

    return (
      <div className="properties-form">
        <p>Property editor will be implemented here.</p>
      </div>
    );
  };

  return (
    <div className="properties-panel">
      <h3 className="panel-title">Properties</h3>
      {renderProperties()}
    </div>
  );
};
