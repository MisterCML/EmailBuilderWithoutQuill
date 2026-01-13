import React, { useState } from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { 
  DndContext, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  type DragEndEvent,
  type DragStartEvent,
  rectIntersection,
  DragOverlay
} from '@dnd-kit/core';
import { EmailProvider } from './context/EmailContext';
import { Header } from './components/Header/Header';
import { EmailBuilder } from './components/EmailBuilder/EmailBuilder';
import { Sidebar } from './components/Sidebar/Sidebar';
import { useEmail } from './context/EmailContext';
import { generateEmailHTML } from './utils/htmlGenerator';
import { createDemoContent } from './utils/demoContent';
import type { ElementType } from './types/email.types';
import './App.css';

const AppContent: React.FC = () => {
  const { 
    emailData, 
    selectedElementId, 
    selectedSectionId, 
    selectedColumnId,
    addElement,
    addSection,
    findElement
  } = useEmail();

  // 跟踪当前拖拽的项目
  const [activeItem, setActiveItem] = useState<{
    id: string;
    type: string;
    data: any;
  } | null>(null);

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 移动8px后才开始拖拽
      },
    })
  );

  // 添加拖拽开始事件处理
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;
    
    setActiveItem({
      id: active.id.toString(),
      type: activeData?.type || 'unknown',
      data: activeData
    });
    
    console.log('Drag start:', active.id, activeData);
  };

  // 添加拖拽移动事件处理（已移除日志以避免频繁输出）
  const handleDragOver = (event: any) => {
    // 可以在这里添加其他拖拽悬停逻辑，但避免频繁日志输出
  };

  const handleGenerateHTML = () => {
    return generateEmailHTML(emailData);
  };

  const getSelectedType = () => {
    if (selectedElementId) return 'element';
    if (selectedSectionId) return 'section';
    if (selectedColumnId) return 'column';
    return null;
  };

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      console.log('Drag ended without a drop target');
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    console.log('Drag end:', { 
      activeId: active.id,
      activeType: activeData?.type,
      overId: over.id,
      overAccepts: overData?.accepts 
    });

    // 从侧边栏拖拽新元素到画布
    if (activeData?.type === 'new-element' && overData?.accepts?.includes('element')) {
      const elementType = activeData.elementType as ElementType;
      const targetSectionId = overData.sectionId;
      const targetColumnIndex = overData.columnIndex;

      if (targetSectionId !== undefined && targetColumnIndex !== undefined) {
        // 确定插入位置
        let position = 0;
        if (overData?.type === 'element-drop-zone') {
          // 如果是拖到元素之间的 drop zone，使用指定的位置
          position = overData.position;
        } else {
          // 如果是拖到空的 column 或 column 整体，添加到末尾
          const section = emailData.sections.find(s => s.id === targetSectionId);
          if (section && section.columns[targetColumnIndex]) {
            position = section.columns[targetColumnIndex].length;
          }
        }

        console.log(`Adding ${elementType} to section ${targetSectionId}, column ${targetColumnIndex}, position ${position}`);
        addElement(targetSectionId, targetColumnIndex, elementType, position);
      }
    }

    // 从侧边栏拖拽新 layout section 到画布
    if (activeData?.type === 'new-layout' && overData?.accepts?.includes('layout')) {
      const layoutType = activeData.layoutType;
      let position = overData.position ?? emailData.sections.length;

      // 如果是拖到 section drop zone，使用其 position
      if (overData?.type === 'section-drop-zone') {
        position = overData.position;
      }

      console.log(`Adding ${layoutType} section at position ${position}`);
      addSection(layoutType, position);
    }

    // TODO: 实现元素排序和Section排序
    
    // 清除拖拽状态
    setActiveItem(null);
  };

  // 渲染拖拽预览
  const renderDragOverlay = () => {
    if (!activeItem) return null;

    if (activeItem.type === 'new-layout') {
      const layoutData = activeItem.data;
      const layoutLabels: Record<string, string> = {
        'single': '1 column',
        'two-left': '1:2 column',
        'two-equal': '2 column',
        'two-right': '2:1 column',
        'three': '3 column'
      };

      return (
        <div style={{
          padding: '10px 8px',
          background: 'white',
          border: '2px solid #0078d4',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'grabbing',
          minWidth: '80px'
        }}>
          <div style={{ fontSize: '11px', textAlign: 'center', color: '#323130' }}>
            {layoutLabels[layoutData?.layoutType] || 'Layout'}
          </div>
        </div>
      );
    }

    if (activeItem.type === 'new-element') {
      const elementData = activeItem.data;
      const elementLabels: Record<string, string> = {
        'text': 'Text',
        'image': 'Image',
        'button': 'Button',
        'qrcode': 'QR code',
        'divider': 'Divider',
        'customcode': 'Custom code'
      };

      return (
        <div style={{
          padding: '12px 8px',
          background: 'white',
          border: '2px solid #0078d4',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'grabbing',
          minWidth: '80px'
        }}>
          <div style={{ fontSize: '11px', textAlign: 'center', color: '#323130' }}>
            {elementLabels[elementData?.elementType] || 'Element'}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={rectIntersection}
    >
      <div className="app">
        <Header onGenerateHTML={handleGenerateHTML} />
        <div className="app-body">
          <EmailBuilder />
          <Sidebar selectedType={getSelectedType()} />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {renderDragOverlay()}
      </DragOverlay>
    </DndContext>
  );
};

function App() {
  // 使用演示内容初始化
  const demoData = createDemoContent();

  return (
    <FluentProvider theme={webLightTheme}>
      <EmailProvider initialData={demoData}>
        <AppContent />
      </EmailProvider>
    </FluentProvider>
  );
}

export default App;
