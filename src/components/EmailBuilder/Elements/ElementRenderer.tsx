import React from 'react';
import type { EmailElement } from '../../../types/email.types';
import { TextElement } from './TextElement';
import { ImageElement } from './ImageElement';
import { ButtonElement } from './ButtonElement';
import { DividerElement } from './DividerElement';

interface ElementRendererProps {
  element: EmailElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<EmailElement>) => void;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isSelected, onUpdate }) => {
  switch (element.type) {
    case 'text':
      return <TextElement element={element} isSelected={isSelected} onUpdate={onUpdate} />;
    case 'image':
      return <ImageElement element={element} isSelected={isSelected} onUpdate={onUpdate} />;
    case 'button':
      return <ButtonElement element={element} />;
    case 'divider':
      return <DividerElement element={element} />;
    default:
      return <div>Unknown element type</div>;
  }
};
