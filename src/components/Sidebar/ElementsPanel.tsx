import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
  TextFont20Regular,
  Image20Regular,
  ControlButton20Regular,
  QrCode20Regular,
  LineHorizontal120Regular,
  Code20Regular,
} from '@fluentui/react-icons';
import './ElementsPanel.css';

const DraggableElement: React.FC<{ id: string; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `element-${id}`,
    data: {
      type: 'new-element',
      elementType: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`element-card ${isDragging ? 'dragging' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

const DraggableLayout: React.FC<{ 
  id: string; 
  label: string; 
  cols: number; 
  widths?: string[] 
}> = ({ id, label, cols, widths }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `layout-${id}`,
    data: {
      type: 'new-layout',
      layoutType: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`layout-card ${isDragging ? 'dragging' : ''}`}
      title={label}
    >
      <div className="layout-preview">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="layout-column"
            style={{ width: widths ? widths[i] : `${100 / cols}%` }}
          />
        ))}
      </div>
      <span>{label}</span>
    </div>
  );
};

export const ElementsPanel: React.FC = () => {
  const elements = [
    { id: 'text', label: 'Text', icon: <TextFont20Regular /> },
    { id: 'image', label: 'Image', icon: <Image20Regular /> },
    { id: 'button', label: 'Button', icon: <ControlButton20Regular /> },
    { id: 'qrcode', label: 'QR code', icon: <QrCode20Regular /> },
    { id: 'divider', label: 'Divider', icon: <LineHorizontal120Regular /> },
    { id: 'customcode', label: 'Custom code', icon: <Code20Regular /> },
  ];

  const layouts = [
    { id: 'single', label: '1 column', cols: 1 },
    { id: 'two-left', label: '1:2 column', cols: 2, widths: ['33%', '67%'] },
    { id: 'two-equal', label: '2 column', cols: 2, widths: ['50%', '50%'] },
    { id: 'two-right', label: '2:1 column', cols: 2, widths: ['67%', '33%'] },
    { id: 'three', label: '3 column', cols: 3, widths: ['33%', '33%', '33%'] },
  ];

  return (
    <div className="elements-panel">
      <div className="panel-section">
        <h3 className="panel-title">Elements</h3>
        <div className="elements-grid">
          {elements.map((element) => (
            <DraggableElement key={element.id} {...element} />
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">Layout section types</h3>
        <div className="layouts-grid">
          {layouts.map((layout) => (
            <DraggableLayout key={layout.id} {...layout} />
          ))}
        </div>
      </div>
    </div>
  );
};
