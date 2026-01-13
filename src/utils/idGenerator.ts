import { v4 as uuidv4 } from 'uuid';

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * 生成带前缀的ID
 */
export const generateIdWithPrefix = (prefix: string): string => {
  return `${prefix}-${uuidv4()}`;
};
