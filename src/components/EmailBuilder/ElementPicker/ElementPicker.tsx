import React from 'react';
import {
  TextFont20Regular,
  Image20Regular,
  ControlButton20Regular,
  LineHorizontal120Regular,
  QrCode20Regular,
  Code20Regular,
} from '@fluentui/react-icons';
import type { ElementType } from '../../../types/email.types';
import './ElementPicker.css';

interface ElementPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (elementType: ElementType) => void;
  title?: string;
}

const ELEMENT_OPTIONS: Array<{
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  available: boolean;
}> = [
  { type: 'text', label: 'Text', icon: <TextFont20Regular />, available: true },
  { type: 'image', label: 'Image', icon: <Image20Regular />, available: true },
  { type: 'button', label: 'Button', icon: <ControlButton20Regular />, available: true },
  { type: 'divider', label: 'Divider', icon: <LineHorizontal120Regular />, available: true },
  { type: 'qrcode', label: 'QR code', icon: <QrCode20Regular />, available: false },
  { type: 'customcode', label: 'Custom code', icon: <Code20Regular />, available: false },
];

export const ElementPicker: React.FC<ElementPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Element',
}) => {
  if (!isOpen) return null;

  const handleSelect = (elementType: ElementType, available: boolean) => {
    if (available) {
      onSelect(elementType);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="element-picker-backdrop" onClick={handleBackdropClick}>
      <div className="element-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="element-picker-header">
          <h3>{title}</h3>
          <button className="element-picker-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="element-picker-grid">
          {ELEMENT_OPTIONS.map((option) => (
            <button
              key={option.type}
              className={`element-picker-item ${option.available ? 'available' : 'placeholder'}`}
              onClick={() => handleSelect(option.type, option.available)}
              disabled={!option.available}
              title={option.available ? option.label : `${option.label} (Coming soon)`}
            >
              <div className="element-picker-icon">{option.icon}</div>
              <span className="element-picker-label">{option.label}</span>
              {!option.available && (
                <span className="element-picker-placeholder-badge">Placeholder</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
