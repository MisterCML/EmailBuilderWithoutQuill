import React from 'react';
import type { EmailElement, ButtonContent } from '../../../types/email.types';
import './ButtonElement.css';

interface ButtonElementProps {
  element: EmailElement;
}

export const ButtonElement: React.FC<ButtonElementProps> = ({ element }) => {
  const content = element.content as ButtonContent;

  return (
    <div className="button-element" style={{ textAlign: element.styles.textAlign || 'center' }}>
      <a
        href={content.link}
        className="email-button"
        style={{
          backgroundColor: element.styles.backgroundColor || '#0078d4',
          color: element.styles.color || '#ffffff',
          padding: element.styles.padding || '10px 20px',
          borderRadius: element.styles.borderRadius || '4px',
          textDecoration: 'none',
          display: 'inline-block',
          fontFamily: 'Arial, Verdana, sans-serif',
          fontSize: element.styles.fontSize || '16px',
        }}
      >
        {content.text}
      </a>
    </div>
  );
};
