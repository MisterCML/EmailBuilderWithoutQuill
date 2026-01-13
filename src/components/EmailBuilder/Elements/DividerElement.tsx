import React from 'react';
import type { EmailElement, DividerContent } from '../../../types/email.types';
import './DividerElement.css';

interface DividerElementProps {
  element: EmailElement;
}

export const DividerElement: React.FC<DividerElementProps> = ({ element }) => {
  const content = element.content as DividerContent;

  return (
    <div
      className="divider-element"
      style={{
        borderTop: element.styles.borderTop || `${content.height || '2px'} solid ${content.color || '#cccccc'}`,
        margin: element.styles.margin || '10px 0',
        width: content.width || '100%',
      }}
    />
  );
};
