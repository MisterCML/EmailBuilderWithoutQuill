import React, { useState } from 'react';
import {
  ArrowLeft20Regular,
  Save20Regular,
  CheckmarkCircle20Regular,
  ArrowUndo20Regular,
  ArrowRedo20Regular,
  Code20Regular,
  Play20Regular,
} from '@fluentui/react-icons';
import { Button, Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-components';
import './Header.css';

interface HeaderProps {
  onGenerateHTML?: () => string;
}

export const Header: React.FC<HeaderProps> = ({ onGenerateHTML }) => {
  const [showHTMLDialog, setShowHTMLDialog] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState('');

  const handleGenerateHTML = () => {
    if (onGenerateHTML) {
      const html = onGenerateHTML();
      setGeneratedHTML(html);
      setShowHTMLDialog(true);
    }
  };

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(generatedHTML);
  };

  return (
    <header className="email-header">
      <div className="header-left">
        <button className="header-icon-button" title="Back">
          <ArrowLeft20Regular />
        </button>
        <div className="header-title">
          <h1>Email Builder Test</h1>
          <span className="header-status">Draft - Unsaved</span>
        </div>
      </div>

      <div className="header-right">
        <button className="header-button" title="Save">
          <Save20Regular />
          <span>Save</span>
        </button>
        <button className="header-button" title="Check content">
          <CheckmarkCircle20Regular />
          <span>Check content</span>
        </button>
        <button className="header-icon-button" title="Undo">
          <ArrowUndo20Regular />
        </button>
        <button className="header-icon-button" title="Redo">
          <ArrowRedo20Regular />
        </button>
        <button className="header-button" onClick={handleGenerateHTML} title="View HTML">
          <Code20Regular />
          <span>HTML</span>
        </button>
        <button className="header-button" title="Test send">
          <Play20Regular />
          <span>Test send</span>
        </button>
        <button className="header-button primary" title="Ready to send">
          Ready to send
        </button>
      </div>

      {/* HTML Dialog */}
      <Dialog open={showHTMLDialog} onOpenChange={(e, data) => setShowHTMLDialog(data.open)}>
        <DialogSurface style={{ maxWidth: '800px', width: '90vw' }}>
          <DialogBody>
            <DialogTitle>Generated HTML</DialogTitle>
            <DialogContent>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '16px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '60vh',
                fontSize: '12px',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace'
              }}>
                {generatedHTML}
              </pre>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setShowHTMLDialog(false)}>
                Close
              </Button>
              <Button appearance="primary" onClick={handleCopyHTML}>
                Copy to Clipboard
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </header>
  );
};
