import React, { createContext, useContext, useState, useCallback } from 'react';
import type { EmailData, EmailSection, EmailElement, ElementType, LayoutType, GlobalStyles } from '../types/email.types';
import { generateIdWithPrefix } from '../utils/idGenerator';

interface EmailContextType {
  emailData: EmailData;
  selectedElementId: string | null;
  selectedSectionId: string | null;
  selectedColumnId: string | null;
  hoveredElementId: string | null;
  hoveredSectionId: string | null;
  hoveredColumnId: string | null;
  
  // Section操作
  addSection: (layout: LayoutType, position: number) => void;
  deleteSection: (sectionId: string) => void;
  selectSection: (sectionId: string) => void;
  hoverSection: (sectionId: string | null) => void;
  updateSectionStyles: (sectionId: string, styles: Partial<EmailSection['styles']>) => void;
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  
  // Element操作
  addElement: (sectionId: string, columnIndex: number, elementType: ElementType, position: number) => void;
  updateElement: (elementId: string, updates: Partial<EmailElement>) => void;
  deleteElement: (elementId: string) => void;
  moveElement: (elementId: string, targetSection: string, targetColumn: number, targetPosition: number) => void;
  selectElement: (elementId: string) => void;
  hoverElement: (elementId: string | null) => void;
  moveElementUp: (elementId: string) => void;
  moveElementDown: (elementId: string) => void;
  
  // Column操作
  selectColumn: (sectionId: string, columnIndex: number) => void;
  hoverColumn: (sectionId: string, columnIndex: number | null) => void;
  updateColumnWidth: (sectionId: string, columnIndex: number, width: string) => void;
  
  // 辅助函数
  findElement: (elementId: string) => { section: EmailSection; sectionIndex: number; columnIndex: number; elementIndex: number; element: EmailElement } | null;
  clearSelection: () => void;
  
  // 全局样式
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within EmailProvider');
  }
  return context;
};

interface EmailProviderProps {
  children: React.ReactNode;
  initialData?: EmailData;
}

export const EmailProvider: React.FC<EmailProviderProps> = ({ children, initialData }) => {
  const [emailData, setEmailData] = useState<EmailData>(
    initialData || {
      sections: [],
      subject: 'Untitled Email',
      globalStyles: {
        layoutMaxWidth: '600px',
        fontFamily: 'Arial, Verdana, sans-serif',
        bodyTextSize: '14px',
        bodyTextColor: '#000000',
        outerBackground: '#FFFFFF',
      },
    }
  );

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null);

  // 创建默认元素
  const createDefaultElement = useCallback((type: ElementType): EmailElement => {
    const id = generateIdWithPrefix('element');
    switch (type) {
      case 'text':
        return {
          id,
          type: 'text',
          content: { html: '<p>Enter your text here...</p>' },
          styles: { padding: '10px' },
        };
      case 'image':
        return {
          id,
          type: 'image',
          content: { align: 'center' },  // 初始时没有图片，只有对齐方式
          styles: { padding: '10px' },
        };
      case 'button':
        return {
          id,
          type: 'button',
          content: { text: 'Button', link: '#' },
          styles: { 
            backgroundColor: '#0078d4', 
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '4px',
            textAlign: 'center'
          },
        };
      case 'divider':
        return {
          id,
          type: 'divider',
          content: {},
          styles: { 
            borderTop: '2px solid #cccccc',
            margin: '10px 0',
            width: '100%'
          },
        };
      default:
        return {
          id,
          type: 'text',
          content: { html: '<p>Unknown element</p>' },
          styles: {},
        };
    }
  }, []);

  // 创建默认Section
  const createDefaultSection = useCallback((layout: LayoutType): EmailSection => {
    const id = generateIdWithPrefix('section');
    let columns: EmailElement[][] = [];
    let columnWidths: string[] = [];

    switch (layout) {
      case 'single':
        columns = [[]];
        columnWidths = ['100%'];
        break;
      case 'two-equal':
        columns = [[], []];
        columnWidths = ['50%', '50%'];
        break;
      case 'two-left':
        columns = [[], []];
        columnWidths = ['33.33%', '66.67%'];
        break;
      case 'two-right':
        columns = [[], []];
        columnWidths = ['66.67%', '33.33%'];
        break;
      case 'three':
        columns = [[], [], []];
        columnWidths = ['33.33%', '33.33%', '33.33%'];
        break;
    }

    return {
      id,
      columns,
      columnWidths,
      styles: {
        padding: '20px',
      },
    };
  }, []);

  // Section操作
  const addSection = useCallback((layout: LayoutType, position: number) => {
    const newSection = createDefaultSection(layout);
    setEmailData((prev) => {
      const newSections = [...prev.sections];
      newSections.splice(position, 0, newSection);
      return { ...prev, sections: newSections };
    });
  }, [createDefaultSection]);

  const deleteSection = useCallback((sectionId: string) => {
    setEmailData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  }, [selectedSectionId]);

  const selectSection = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
    setSelectedElementId(null);
    setSelectedColumnId(null);
  }, []);

  const hoverSection = useCallback((sectionId: string | null) => {
    setHoveredSectionId(sectionId);
  }, []);

  const updateSectionStyles = useCallback((sectionId: string, styles: Partial<EmailSection['styles']>) => {
    setEmailData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, styles: { ...s.styles, ...styles } } : s
      ),
    }));
  }, []);

  const moveSectionUp = useCallback((sectionId: string) => {
    setEmailData((prev) => {
      const sectionIndex = prev.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex <= 0) return prev;
      
      const newSections = [...prev.sections];
      [newSections[sectionIndex - 1], newSections[sectionIndex]] = 
        [newSections[sectionIndex], newSections[sectionIndex - 1]];
      
      return { ...prev, sections: newSections };
    });
  }, []);

  const moveSectionDown = useCallback((sectionId: string) => {
    setEmailData((prev) => {
      const sectionIndex = prev.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex < 0 || sectionIndex >= prev.sections.length - 1) return prev;
      
      const newSections = [...prev.sections];
      [newSections[sectionIndex], newSections[sectionIndex + 1]] = 
        [newSections[sectionIndex + 1], newSections[sectionIndex]];
      
      return { ...prev, sections: newSections };
    });
  }, []);

  // Element操作
  const addElement = useCallback((sectionId: string, columnIndex: number, elementType: ElementType, position: number) => {
    const newElement = createDefaultElement(elementType);
    setEmailData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === sectionId) {
          const newColumns = [...s.columns];
          if (newColumns[columnIndex]) {
            const newColumn = [...newColumns[columnIndex]];
            newColumn.splice(position, 0, newElement);
            newColumns[columnIndex] = newColumn;
          }
          return { ...s, columns: newColumns };
        }
        return s;
      }),
    }));
  }, [createDefaultElement]);

  const updateElement = useCallback((elementId: string, updates: Partial<EmailElement>) => {
    setEmailData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        columns: section.columns.map((column) =>
          column.map((element) =>
            element.id === elementId ? { ...element, ...updates } : element
          )
        ),
      })),
    }));
  }, []);

  const deleteElement = useCallback((elementId: string) => {
    setEmailData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        columns: section.columns.map((column) =>
          column.filter((element) => element.id !== elementId)
        ),
      })),
    }));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const findElement = useCallback((elementId: string) => {
    for (let sectionIndex = 0; sectionIndex < emailData.sections.length; sectionIndex++) {
      const section = emailData.sections[sectionIndex];
      for (let columnIndex = 0; columnIndex < section.columns.length; columnIndex++) {
        const column = section.columns[columnIndex];
        const elementIndex = column.findIndex((e) => e.id === elementId);
        if (elementIndex !== -1) {
          return {
            section,
            sectionIndex,
            columnIndex,
            elementIndex,
            element: column[elementIndex],
          };
        }
      }
    }
    return null;
  }, [emailData.sections]);

  const moveElement = useCallback((
    elementId: string,
    targetSection: string,
    targetColumn: number,
    targetPosition: number
  ) => {
    const elementInfo = findElement(elementId);
    if (!elementInfo) return;

    const { element } = elementInfo;

    setEmailData((prev) => {
      // 先删除元素
      let newSections = prev.sections.map((section) => ({
        ...section,
        columns: section.columns.map((column) =>
          column.filter((e) => e.id !== elementId)
        ),
      }));

      // 再插入到目标位置
      newSections = newSections.map((section) => {
        if (section.id === targetSection) {
          const newColumns = [...section.columns];
          if (newColumns[targetColumn]) {
            const newColumn = [...newColumns[targetColumn]];
            newColumn.splice(targetPosition, 0, element);
            newColumns[targetColumn] = newColumn;
          }
          return { ...section, columns: newColumns };
        }
        return section;
      });

      return { ...prev, sections: newSections };
    });
  }, [findElement]);

  const selectElement = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
    setSelectedSectionId(null);
    setSelectedColumnId(null);
  }, []);

  const hoverElement = useCallback((elementId: string | null) => {
    setHoveredElementId(elementId);
  }, []);

  const moveElementUp = useCallback((elementId: string) => {
    const elementInfo = findElement(elementId);
    if (!elementInfo || elementInfo.elementIndex === 0) return;

    setEmailData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIdx) => {
        if (sIdx === elementInfo.sectionIndex) {
          const newColumns = [...section.columns];
          const newColumn = [...newColumns[elementInfo.columnIndex]];
          [newColumn[elementInfo.elementIndex - 1], newColumn[elementInfo.elementIndex]] =
            [newColumn[elementInfo.elementIndex], newColumn[elementInfo.elementIndex - 1]];
          newColumns[elementInfo.columnIndex] = newColumn;
          return { ...section, columns: newColumns };
        }
        return section;
      }),
    }));
  }, [findElement]);

  const moveElementDown = useCallback((elementId: string) => {
    const elementInfo = findElement(elementId);
    if (!elementInfo) return;

    const column = emailData.sections[elementInfo.sectionIndex].columns[elementInfo.columnIndex];
    if (elementInfo.elementIndex >= column.length - 1) return;

    setEmailData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIdx) => {
        if (sIdx === elementInfo.sectionIndex) {
          const newColumns = [...section.columns];
          const newColumn = [...newColumns[elementInfo.columnIndex]];
          [newColumn[elementInfo.elementIndex], newColumn[elementInfo.elementIndex + 1]] =
            [newColumn[elementInfo.elementIndex + 1], newColumn[elementInfo.elementIndex]];
          newColumns[elementInfo.columnIndex] = newColumn;
          return { ...section, columns: newColumns };
        }
        return section;
      }),
    }));
  }, [findElement, emailData.sections]);

  // Column操作
  const selectColumn = useCallback((sectionId: string, columnIndex: number) => {
    setSelectedColumnId(`${sectionId}-col-${columnIndex}`);
    setSelectedElementId(null);
    setSelectedSectionId(null);
  }, []);

  const hoverColumn = useCallback((sectionId: string, columnIndex: number | null) => {
    setHoveredColumnId(columnIndex !== null ? `${sectionId}-col-${columnIndex}` : null);
  }, []);

  const updateColumnWidth = useCallback((sectionId: string, columnIndex: number, width: string) => {
    setEmailData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === sectionId && s.columnWidths) {
          const newWidths = [...s.columnWidths];
          newWidths[columnIndex] = width;
          return { ...s, columnWidths: newWidths };
        }
        return s;
      }),
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedElementId(null);
    setSelectedSectionId(null);
    setSelectedColumnId(null);
  }, []);

  const updateGlobalStyles = useCallback((styles: Partial<GlobalStyles>) => {
    setEmailData((prev) => ({
      ...prev,
      globalStyles: { ...prev.globalStyles, ...styles },
    }));
  }, []);

  const value: EmailContextType = {
    emailData,
    selectedElementId,
    selectedSectionId,
    selectedColumnId,
    hoveredElementId,
    hoveredSectionId,
    hoveredColumnId,
    addSection,
    deleteSection,
    selectSection,
    hoverSection,
    updateSectionStyles,
    moveSectionUp,
    moveSectionDown,
    addElement,
    updateElement,
    deleteElement,
    moveElement,
    selectElement,
    hoverElement,
    moveElementUp,
    moveElementDown,
    selectColumn,
    hoverColumn,
    updateColumnWidth,
    findElement,
    clearSelection,
    updateGlobalStyles,
  };

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};
