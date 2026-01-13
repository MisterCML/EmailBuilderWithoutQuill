import React from 'react';
import { EmailCanvas } from './Canvas/EmailCanvas';
import './EmailBuilder.css';

export const EmailBuilder: React.FC = () => {
  return (
    <div className="email-builder">
      <EmailCanvas />
    </div>
  );
};
