import React, { useState } from 'react';
import {
  Apps20Regular,
  Settings20Regular,
  Person20Regular,
} from '@fluentui/react-icons';
import { ElementsPanel } from './ElementsPanel';
import { PropertiesPanel } from './PropertiesPanel';
import './Sidebar.css';

type TabType = 'elements' | 'properties' | 'personal';

interface SidebarProps {
  selectedType?: 'element' | 'section' | 'column' | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedType }) => {
  const [activeTab, setActiveTab] = useState<TabType>('elements');

  React.useEffect(() => {
    if (selectedType) {
      setActiveTab('properties');
    } else {
      setActiveTab('elements');
    }
  }, [selectedType]);

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {activeTab === 'elements' && <ElementsPanel />}
        {activeTab === 'properties' && <PropertiesPanel selectedType={selectedType} />}
        {activeTab === 'personal' && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#605e5c' }}>
            Personal tab (Coming soon)
          </div>
        )}
      </div>
      <div className="sidebar-tabs">
        <button
          className={`tab-button ${activeTab === 'elements' ? 'active' : ''}`}
          onClick={() => setActiveTab('elements')}
          title="Elements"
        >
          <Apps20Regular />
        </button>
        <button
          className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
          title="Properties"
        >
          <Settings20Regular />
        </button>
        <button
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
          title="Personal"
        >
          <Person20Regular />
        </button>
      </div>
    </div>
  );
};
