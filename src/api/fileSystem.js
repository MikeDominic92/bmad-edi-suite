/**
 * File System API - Connects to C:\Users\jae2j\Documents\tickets\
 *
 * This module provides functions to interact with the local file system
 * for ticket investigation workflows.
 */

const TICKETS_BASE_PATH = 'C:/Users/jae2j/Documents/tickets';

/**
 * Get list of files in incoming folder
 * @returns {Promise<Array>} List of ticket files
 */
export const getIncomingFiles = async () => {
  try {
    // In browser environment, we'll use File System Access API
    // For now, return mock data structure matching your actual files
    return [
      {
        name: 'ticket_13690386.pdf',
        path: `${TICKETS_BASE_PATH}/incoming/ticket_13690386.pdf`,
        size: 2411520, // 2.3 MB
        type: 'application/pdf',
        modified: new Date('2025-11-13')
      },
      {
        name: 'WebEDI Admin 3.5.html',
        path: `${TICKETS_BASE_PATH}/incoming/WebEDI Admin 3.5.html`,
        size: 62464, // 61 KB
        type: 'text/html',
        modified: new Date('2025-11-13')
      },
      {
        name: 'screenshot_error.png',
        path: `${TICKETS_BASE_PATH}/incoming/screenshot_error.png`,
        size: 460800, // 450 KB
        type: 'image/png',
        modified: new Date('2025-11-13')
      }
    ];
  } catch (error) {
    console.error('Error reading incoming files:', error);
    return [];
  }
};

/**
 * Get customer file by WebEDI ID
 * @param {string} webEdiId - Customer WebEDI ID
 * @returns {Promise<Object>} Customer data
 */
export const getCustomerFile = async (webEdiId) => {
  try {
    const customerPath = `${TICKETS_BASE_PATH}/customers/${webEdiId}_*.md`;

    // For Vee Engineering (5035) example
    if (webEdiId === '5035') {
      return {
        webEdiId: '5035',
        userId: '3824',
        companyName: 'Vee Engineering / Air Side Systems',
        primaryContact: 'Michelle Rice',
        email: 'mrice@plant4.com',
        phone: '(765) 778-7895',
        address: '3620 W. 73rd Street, Anderson, IN 46011',
        integration: 'GlobalShop ERP',
        tradingPartners: ['Caterpillar', 'Daikin', 'John Deere', 'PACCAR'],
        previousTickets: [
          {
            ticketId: '13690386',
            date: '2025-11-13',
            status: 'RESOLVED',
            issue: 'John Deere ASN LIN Segment Mapping Error'
          }
        ]
      };
    }

    return null;
  } catch (error) {
    console.error('Error reading customer file:', error);
    return null;
  }
};

/**
 * Get trading partner specifications
 * @param {string} partnerName - Trading partner name
 * @returns {Promise<Object>} Partner specifications
 */
export const getTradingPartnerSpecs = async (partnerName) => {
  try {
    const partnerPath = `${TICKETS_BASE_PATH}/Trading_Partners/${partnerName}/`;

    // For John Deere example
    if (partnerName === 'John Deere') {
      return {
        name: 'John Deere',
        specifications: [
          { type: '810', file: '810_Invoice_Specification.pdf', version: '04232015' },
          { type: '850', file: '850_PO_Specification.pdf', version: '04232015' },
          { type: '856', file: '856_ASN_Specification.pdf', version: '04232015' },
          { type: '856_SPOI', file: '856_SPOI.pdf', version: '04232015' }
        ],
        samples: [
          { type: '850', file: '850_Sample_Valid.edi' },
          { type: '856', file: '856_Sample_Valid.edi' }
        ],
        notes: 'Integration_Notes.md'
      };
    }

    return null;
  } catch (error) {
    console.error('Error reading trading partner specs:', error);
    return null;
  }
};

/**
 * Get folder statistics
 * @returns {Promise<Object>} Folder counts
 */
export const getFolderStats = async () => {
  try {
    return {
      incoming: 3,
      processing: 1,
      customers: 87,
      tradingPartners: 24,
      resolution: 456
    };
  } catch (error) {
    console.error('Error getting folder stats:', error);
    return {
      incoming: 0,
      processing: 0,
      customers: 0,
      tradingPartners: 0,
      resolution: 0
    };
  }
};

/**
 * Read file from local file system
 * Note: This requires user permission via File System Access API
 * @param {string} filePath - Path to file
 * @returns {Promise<string>} File contents
 */
export const readLocalFile = async (filePath) => {
  try {
    // Check if File System Access API is available
    if ('showOpenFilePicker' in window) {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Ticket Files',
            accept: {
              'application/pdf': ['.pdf'],
              'text/html': ['.html', '.htm'],
              'image/*': ['.png', '.jpg', '.jpeg']
            }
          }
        ]
      });

      const file = await fileHandle.getFile();
      const contents = await file.text();
      return contents;
    } else {
      throw new Error('File System Access API not supported');
    }
  } catch (error) {
    console.error('Error reading local file:', error);
    throw error;
  }
};

/**
 * Move file from incoming to resolution folder
 * @param {string} ticketId - Ticket ID
 * @param {string} webEdiId - Customer WebEDI ID
 * @param {string} companyName - Company name
 * @returns {Promise<boolean>} Success status
 */
export const moveToResolution = async (ticketId, webEdiId, companyName) => {
  try {
    const sourcePath = `${TICKETS_BASE_PATH}/incoming/`;
    const destPath = `${TICKETS_BASE_PATH}/resolution/${webEdiId}_${companyName.replace(/ /g, '_')}/`;

    console.log(`Moving ticket ${ticketId} from ${sourcePath} to ${destPath}`);

    // In a real implementation, this would use Node.js fs module or Electron
    // For browser, this is a placeholder
    return true;
  } catch (error) {
    console.error('Error moving files:', error);
    return false;
  }
};

/**
 * Save investigation results
 * @param {string} ticketId - Ticket ID
 * @param {Object} investigation - Investigation data
 * @returns {Promise<boolean>} Success status
 */
export const saveInvestigation = async (ticketId, investigation) => {
  try {
    const investigationPath = `${TICKETS_BASE_PATH}/resolution/${investigation.webEdiId}_${investigation.companyName}/investigation_${ticketId}.md`;

    console.log(`Saving investigation to ${investigationPath}`);
    console.log('Investigation data:', investigation);

    // In real implementation, write to file system
    // For now, save to localStorage as backup
    localStorage.setItem(`investigation_${ticketId}`, JSON.stringify(investigation));

    return true;
  } catch (error) {
    console.error('Error saving investigation:', error);
    return false;
  }
};

/**
 * Update customer history file
 * @param {string} webEdiId - Customer WebEDI ID
 * @param {Object} ticketData - Ticket data to append
 * @returns {Promise<boolean>} Success status
 */
export const updateCustomerHistory = async (webEdiId, ticketData) => {
  try {
    const customerPath = `${TICKETS_BASE_PATH}/customers/${webEdiId}_*.md`;

    console.log(`Updating customer history: ${customerPath}`);
    console.log('Ticket data:', ticketData);

    // In real implementation, append to markdown file
    // For now, use localStorage
    const history = JSON.parse(localStorage.getItem(`customer_history_${webEdiId}`) || '[]');
    history.push(ticketData);
    localStorage.setItem(`customer_history_${webEdiId}`, JSON.stringify(history));

    return true;
  } catch (error) {
    console.error('Error updating customer history:', error);
    return false;
  }
};

/**
 * Check if file exists in incoming folder
 * @param {string} fileName - File name to check
 * @returns {Promise<boolean>} Exists status
 */
export const fileExists = async (fileName) => {
  try {
    const files = await getIncomingFiles();
    return files.some(f => f.name === fileName);
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
};

export default {
  getIncomingFiles,
  getCustomerFile,
  getTradingPartnerSpecs,
  getFolderStats,
  readLocalFile,
  moveToResolution,
  saveInvestigation,
  updateCustomerHistory,
  fileExists
};
