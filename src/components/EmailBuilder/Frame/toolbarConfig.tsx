import React from 'react';
import {
  Delete20Regular,
  ArrowUp20Regular,
  ArrowDown20Regular,
} from '@fluentui/react-icons';
import type { ToolbarButton } from '../../../types/email.types';

export const getToolbarButtons = (
  onDelete: () => void,
  onMoveUp?: () => void,
  onMoveDown?: () => void,
  canMoveUp?: boolean,
  canMoveDown?: boolean
): ToolbarButton[] => {
  const buttons: ToolbarButton[] = [];

  // 上移按钮
  if (onMoveUp) {
    buttons.push({
      id: 'move-up',
      icon: <ArrowUp20Regular />,
      label: 'Move up',
      onClick: onMoveUp,
      disabled: !canMoveUp,
    });
  }

  // 下移按钮
  if (onMoveDown) {
    buttons.push({
      id: 'move-down',
      icon: <ArrowDown20Regular />,
      label: 'Move down',
      onClick: onMoveDown,
      disabled: !canMoveDown,
    });
  }

  // 删除按钮
  buttons.push({
    id: 'delete',
    icon: <Delete20Regular />,
    label: 'Delete',
    onClick: onDelete,
    disabled: false,
  });

  return buttons;
};
