const pdf = require('pdf-parse');
const { JSDOM } = require('jsdom');
const fs = require('fs').promises;
const path = require('path');

class FileProcessor {
  constructor() {
    this.gemini = null;
  }

  async initialize() {
    // Check if Google AI Studio skill exists
    try {
      const skillPath = path.join(process.env.USERPROFILE, '.claude', 'skills', 'google-ai-studio');
      await fs.access(skillPath);
      console.log('[FileProcessor] Google AI Studio skill found - OCR available');
    } catch {
      console.log('[FileProcessor] Google AI Studio skill not found - OCR disabled');
    }
  }

  async processTicketFiles(incomingPath) {
    const files = await fs.readdir(incomingPath);

    const results = {
      pdfContent: '',
      htmlContent: '',
      imageContent: '',
      filesFound: []
    };

    for (const file of files) {
      const filePath = path.join(incomingPath, file);
      const ext = path.extname(file).toLowerCase();

      try {
        if (ext === '.pdf') {
          results.pdfContent = await this.parsePDF(filePath);
          results.filesFound.push({ name: file, type: 'pdf', path: filePath });
          console.log(`[FileProcessor] Parsed PDF: ${file}`);
        } else if (ext === '.html' || ext === '.htm') {
          results.htmlContent = await this.parseHTML(filePath);
          results.filesFound.push({ name: file, type: 'html', path: filePath });
          console.log(`[FileProcessor] Parsed HTML: ${file}`);
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.bmp'].includes(ext)) {
          results.imageContent = await this.parseImage(filePath);
          results.filesFound.push({ name: file, type: 'image', path: filePath });
          console.log(`[FileProcessor] Parsed Image: ${file}`);
        }
      } catch (error) {
        console.error(`[FileProcessor] Error processing ${file}:`, error.message);
        results.filesFound.push({
          name: file,
          type: 'error',
          error: error.message
        });
      }
    }

    return results;
  }

  async parsePDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      console.error(`[FileProcessor] PDF parse error: ${error.message}`);
      return `[PDF Parse Error: ${error.message}]`;
    }
  }

  async parseHTML(filePath) {
    try {
      const htmlContent = await fs.readFile(filePath, 'utf-8');
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;

      // Remove script and style tags
      const scripts = document.querySelectorAll('script, style');
      scripts.forEach(el => el.remove());

      // Extract text content
      let text = document.body.textContent || '';

      // Clean up whitespace
      text = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

      // Also try to extract table data if present
      const tables = document.querySelectorAll('table');
      if (tables.length > 0) {
        text += '\n\n[TABLE DATA]\n';
        tables.forEach(table => {
          const rows = table.querySelectorAll('tr');
          rows.forEach(row => {
            const cells = row.querySelectorAll('td, th');
            const rowData = Array.from(cells).map(cell => cell.textContent.trim()).join(' | ');
            text += rowData + '\n';
          });
        });
      }

      return text;
    } catch (error) {
      console.error(`[FileProcessor] HTML parse error: ${error.message}`);
      return `[HTML Parse Error: ${error.message}]`;
    }
  }

  async parseImage(filePath) {
    try {
      // For now, return placeholder
      // In production, this would integrate with Google AI Studio skill
      // or use tesseract.js for OCR
      const fileName = path.basename(filePath);
      return `[Image file: ${fileName} - OCR not yet implemented. Will integrate with Google AI Studio skill for OCR.]`;
    } catch (error) {
      console.error(`[FileProcessor] Image parse error: ${error.message}`);
      return `[Image Parse Error: ${error.message}]`;
    }
  }

  async cleanup() {
    // Cleanup resources if needed
    if (this.gemini) {
      // await this.gemini.cleanup();
    }
  }
}

module.exports = { FileProcessor };
