import type { EmailData } from '../types/email.types';
import { generateIdWithPrefix } from './idGenerator';

/**
 * 创建演示邮件内容
 */
export function createDemoContent(): EmailData {
  return {
    subject: 'Welcome to Email Builder',
    globalStyles: {
      layoutMaxWidth: '600px',
      fontFamily: 'Arial, Verdana, sans-serif',
      bodyTextSize: '14px',
      bodyTextColor: '#000000',
      outerBackground: '#FFFFFF',
    },
    sections: [
      // Section 1: Header with title
      {
        id: generateIdWithPrefix('section'),
        columns: [
          [
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<h2 style="color: #0078d4; margin: 0;">Welcome to Our Newsletter</h2>',
              },
              styles: {
                padding: '20px',
                textAlign: 'center',
              },
            },
          ],
        ],
        columnWidths: ['100%'],
        styles: {
          padding: '20px',
        },
      },
      // Section 2: Main content
      {
        id: generateIdWithPrefix('section'),
        columns: [
          [
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<h3>Latest Updates</h3><p>Check out our latest features and improvements.</p>',
              },
              styles: {
                padding: '10px 0',
              },
            },
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<p>We\'ve been working hard to bring you the best experience. Here are some highlights:</p>',
              },
              styles: {
                padding: '10px 0',
              },
            },
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<ul><li>Improved performance</li><li>New design elements</li><li>Better mobile support</li></ul>',
              },
              styles: {
                padding: '10px 0',
              },
            },
            {
              id: generateIdWithPrefix('element'),
              type: 'divider',
              content: {},
              styles: {
                borderTop: '2px solid #cccccc',
                margin: '20px 0',
                width: '100%',
              },
            },
          ],
          [
            {
              id: generateIdWithPrefix('element'),
              type: 'button',
              content: {
                text: 'Learn More',
                link: '#',
              },
              styles: {
                backgroundColor: '#0078d4',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '4px',
                textAlign: 'center',
              },
            },
          ],
        ],
        columnWidths: ['60%', '40%'],
        styles: {
          padding: '30px',
        },
      },
      // Section 3: Three columns
      {
        id: generateIdWithPrefix('section'),
        columns: [
          [
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<h4 style="color: #0078d4;">Fast</h4><p>Lightning-fast performance for all your needs.</p>',
              },
              styles: {
                padding: '10px',
                textAlign: 'center',
              },
            },
          ],
          [
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<h4 style="color: #0078d4;">Reliable</h4><p>Built with stability and security in mind.</p>',
              },
              styles: {
                padding: '10px',
                textAlign: 'center',
              },
            },
          ],
          [
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<h4 style="color: #0078d4;">Easy</h4><p>Simple and intuitive interface for everyone.</p>',
              },
              styles: {
                padding: '10px',
                textAlign: 'center',
              },
            },
          ],
        ],
        columnWidths: ['33.33%', '33.33%', '33.33%'],
        styles: {
          padding: '30px',
        },
      },
      // Section 4: Footer
      {
        id: generateIdWithPrefix('section'),
        columns: [
          [
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<p style="font-size: 12px; color: #666;">© 2026 Email Builder. All rights reserved.</p>',
              },
              styles: {
                padding: '10px 0',
                textAlign: 'center',
              },
            },
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<p style="font-size: 12px; color: #666;">123 Business Street, City, State 12345</p>',
              },
              styles: {
                padding: '5px 0',
                textAlign: 'center',
              },
            },
            {
              id: generateIdWithPrefix('element'),
              type: 'text',
              content: {
                html: '<p style="font-size: 12px;"><a href="#" style="color: #0078d4;">Unsubscribe</a> | <a href="#" style="color: #0078d4;">Manage Preferences</a></p>',
              },
              styles: {
                padding: '10px 0',
                textAlign: 'center',
              },
            },
          ],
        ],
        columnWidths: ['100%'],
        styles: {
          padding: '30px 20px',
        },
      },
    ],
  };
}
