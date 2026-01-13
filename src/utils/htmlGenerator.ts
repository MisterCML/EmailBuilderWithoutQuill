import type { EmailData, EmailSection, EmailElement } from '../types/email.types';

/**
 * 生成邮件HTML
 */
export function generateEmailHTML(emailData: EmailData): string {
  const { sections, subject, globalStyles } = emailData;

  const styles = globalStyles || {
    layoutMaxWidth: '600px',
    fontFamily: 'Arial, Verdana, sans-serif',
    bodyTextSize: '14px',
    bodyTextColor: '#000000',
    outerBackground: '#FFFFFF',
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || 'Email'}</title>
  <meta name="referrer" content="never">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <meta name="x-apple-disable-message-reformatting">
  
  <style>
    body {
      font-family: ${styles.fontFamily};
      font-size: ${styles.bodyTextSize};
      color: ${styles.bodyTextColor};
      background-color: ${styles.outerBackground};
      margin: 0;
      padding: 0;
    }
    h1 {
      color: #000;
      font-size: 34px;
      font-weight: normal;
      font-family: Verdana, Arial, sans-serif;
      line-height: inherit;
      text-align: left;
      margin: 0px;
    }
    h2 {
      color: #333;
      font-size: 24px;
      font-weight: normal;
      font-family: sans-serif;
      line-height: inherit;
      text-align: left;
      margin: 0px;
    }
    h3 {
      color: #000;
      font-size: 16px;
      font-weight: normal;
      font-family: Verdana, Arial, sans-serif;
      line-height: inherit;
      text-align: left;
      margin: 0px;
    }
    p {
      font-family: ${styles.fontFamily};
      font-size: ${styles.bodyTextSize};
      color: ${styles.bodyTextColor};
      line-height: inherit;
      font-weight: normal;
      text-align: left;
      margin: 0;
      padding: 0;
    }
    li {
      font-family: ${styles.fontFamily};
      font-size: ${styles.bodyTextSize};
      color: ${styles.bodyTextColor};
      line-height: inherit;
      font-weight: normal;
      text-align: left;
    }
    a {
      font-family: ${styles.fontFamily};
      color: #0082dd;
      text-decoration: none;
    }
    
    .buttonWrapper {
      margin: 10px 0px;
    }
    .buttonClass {
      font-family: ${styles.fontFamily};
      font-size: 16px;
      border-radius: 4px;
      color: white;
      background-color: rgb(7, 66, 171);
      padding: 10px 20px;
      text-decoration: none;
      display: inline-block;
    }
    .divider {
      border-top: 2px solid silver;
      margin: 10px 0px;
      width: 100%;
    }
    
    [data-layout="true"] {
      margin: 0 auto;
      background-color: #fff;
      max-width: /* @layout-max-width */ ${styles.layoutMaxWidth} /* @layout-max-width */;
    }
    
    /* Email client resets */
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
  </style>
</head>
<body>
  <div data-layout="true">
${sections.map((section) => generateSectionHTML(section)).join('\n')}
  </div>
</body>
</html>`;
}

/**
 * 生成Section的HTML
 */
function generateSectionHTML(section: EmailSection): string {
  const bgColor = section.styles?.backgroundColor || '#ffffff';
  const padding = section.styles?.padding || '20px';

  return `    <div data-section="true">
      <table class="outer" role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <th role="presentation" style="background-color: ${bgColor}; padding: ${padding};">
              <table class="containerWrapper" role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                  <tr>
${section.columns.map((column, index) => generateColumnHTML(column, section.columnWidths?.[index] || '100%')).join('\n')}
                  </tr>
                </tbody>
              </table>
            </th>
          </tr>
        </tbody>
      </table>
    </div>`;
}

/**
 * 生成Column的HTML
 */
function generateColumnHTML(elements: EmailElement[], width: string): string {
  return `                    <th data-container="true" class="columnContainer" role="presentation" style="vertical-align: top; width: ${width};">
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tbody>
                          <tr>
                            <th class="columnContainer inner" role="presentation" style="vertical-align: top; padding: 10px;">
${elements.map((element) => generateElementHTML(element)).join('\n')}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </th>`;
}

/**
 * 生成Element的HTML
 */
function generateElementHTML(element: EmailElement): string {
  switch (element.type) {
    case 'text':
      return generateTextHTML(element);
    case 'image':
      return generateImageHTML(element);
    case 'button':
      return generateButtonHTML(element);
    case 'divider':
      return generateDividerHTML(element);
    default:
      return '';
  }
}

function generateTextHTML(element: EmailElement): string {
  const content = element.content as { html: string };
  const padding = element.styles.padding || '10px 0';
  return `                              <div style="padding: ${padding};">
${content.html}
                              </div>`;
}

function generateImageHTML(element: EmailElement): string {
  const content = element.content as { src?: string; alt?: string; width?: string; height?: string; link?: string; align?: 'left' | 'center' | 'right' };
  const padding = element.styles.padding || '10px 0';
  const align = content.align || 'center';
  
  // 如果没有图片，返回空字符串
  if (!content.src || content.src.trim() === '') {
    return '';
  }
  
  const imgTag = `<img src="${content.src}" alt="${content.alt || 'Image'}" style="display: block; width: ${content.width || '100%'}; height: ${content.height || 'auto'}; max-width: 100%;">`;
  
  if (content.link) {
    return `                              <div style="padding: ${padding}; text-align: ${align};">
                                <a href="${content.link}" target="_blank" rel="noopener noreferrer">
                                  ${imgTag}
                                </a>
                              </div>`;
  }
  
  return `                              <div style="padding: ${padding}; text-align: ${align};">
                                ${imgTag}
                              </div>`;
}

function generateButtonHTML(element: EmailElement): string {
  const content = element.content as { text: string; link: string };
  const bgColor = element.styles.backgroundColor || '#0078d4';
  const color = element.styles.color || '#ffffff';
  const padding = element.styles.padding || '10px 20px';
  const borderRadius = element.styles.borderRadius || '4px';
  const textAlign = element.styles.textAlign || 'center';
  
  return `                              <div class="buttonWrapper" style="text-align: ${textAlign};">
                                <a href="${content.link}" class="buttonClass" style="background-color: ${bgColor}; color: ${color}; padding: ${padding}; border-radius: ${borderRadius}; text-decoration: none; display: inline-block;">
                                  ${content.text}
                                </a>
                              </div>`;
}

function generateDividerHTML(element: EmailElement): string {
  const borderTop = element.styles.borderTop || '2px solid #cccccc';
  const margin = element.styles.margin || '10px 0';
  const width = element.styles.width || '100%';
  
  return `                              <div class="divider" style="border-top: ${borderTop}; margin: ${margin}; width: ${width};"></div>`;
}

/**
 * 移除编辑器UI
 */
export function stripEditorUI(html: string): string {
  // 移除Frame相关的类和属性
  let clean = html;
  
  // 移除inlineFrame和inlineOverlay相关的div
  clean = clean.replace(/<div class="inlineFrame[^"]*"[^>]*>/g, '');
  clean = clean.replace(/<div class="inlineOverlay"[^>]*>[\s\S]*?<\/div>\s*<div class="inlineContent">/g, '');
  clean = clean.replace(/<\/div>\s*<\/div>/g, '</div>');
  
  // 移除data-frame-type属性
  clean = clean.replace(/data-frame-type="[^"]*"/g, '');
  
  return clean;
}
