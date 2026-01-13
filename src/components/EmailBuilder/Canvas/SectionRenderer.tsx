import React from 'react';
import { useEmail } from '../../../context/EmailContext';
import type { EmailSection } from '../../../types/email.types';
import { ColumnWrapper } from './ColumnWrapper';
import { FrameWrapper } from '../Frame/FrameWrapper';
import './SectionRenderer.css';

interface SectionRendererProps {
  section: EmailSection;
  sectionIndex: number;
  totalSections: number;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, sectionIndex, totalSections }) => {
  const {
    selectedSectionId,
    hoveredSectionId,
    selectSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    addSection,
  } = useEmail();

  const isSelected = selectedSectionId === section.id;
  const isHovered = hoveredSectionId === section.id;

  const handlePrepend = () => {
    addSection('single', sectionIndex);
  };

  const handleAppend = () => {
    addSection('single', sectionIndex + 1);
  };

  return (
    <FrameWrapper
      frameType="section"
      isSelected={isSelected}
      isHovered={isHovered}
      onSelect={() => selectSection(section.id)}
      onDelete={() => deleteSection(section.id)}
      onMoveUp={() => moveSectionUp(section.id)}
      onMoveDown={() => moveSectionDown(section.id)}
      canMoveUp={sectionIndex > 0}
      canMoveDown={sectionIndex < totalSections - 1}
      showAddButtons={isSelected}
      showPrependButton={true}
      onPrepend={handlePrepend}
      onAppend={handleAppend}
    >
      <div data-section="true">
        <table className="outer" role="presentation" cellPadding="0" cellSpacing="0" width="100%">
          <tbody>
            <tr>
              <th role="presentation" style={{ padding: section.styles?.padding }}>
                <table className="containerWrapper" role="presentation" cellPadding="0" cellSpacing="0" width="100%">
                  <tbody>
                    <tr>
                      {section.columns.map((columnElements, columnIndex) => (
                        <ColumnWrapper
                          key={`${section.id}-col-${columnIndex}`}
                          section={section}
                          columnIndex={columnIndex}
                          elements={columnElements}
                        />
                      ))}
                    </tr>
                  </tbody>
                </table>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </FrameWrapper>
  );
};
