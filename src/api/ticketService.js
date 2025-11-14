/**
 * Ticket Service - Handles ticket data loading and processing
 */

import { getIncomingFiles, getCustomerFile, getTradingPartnerSpecs } from './fileSystem';

/**
 * Load ticket data from Vee Engineering example
 * This simulates reading from actual ticket files
 */
export const loadVeeEngineeringTicket = () => {
  return {
    ticketId: '13690386',
    webEdiId: '5035',
    userId: '3824',
    companyName: 'Vee Engineering / Air Side Systems',
    customerName: 'Michelle Rice',
    email: 'mrice@plant4.com',
    phone: '(765) 778-7895',
    tradingPartner: 'John Deere AG Waterloo',
    tradingPartnerWebEdiId: '2234',
    documentType: '856 ASN (Ship Notice/Manifest)',
    integrationType: 'Outbound 856 ASN to John Deere via AS2B',
    priority: 'HIGH',
    errorReported: 'LIN segment formatting error causing ASN rejection',
    ticketDescription: `Customer submitted ASN transactions to John Deere but system showed "No ASN" status. John Deere contact identified LIN segment formatting did not match specification requirements.`,
    filesFound: [
      { name: 'ticket_13690386.pdf', size: '2.3 MB' },
      { name: 'WebEDI Admin 3.5.html', size: '61 KB' },
      { name: 'screenshot_error.png', size: '450 KB' }
    ],
    verified: true,
    verificationStatus: {
      ticketPdfMatchesWebEdiAdmin: 'PASS VERIFIED',
      filesInventoried: '3 files found'
    }
  };
};

/**
 * Load actual ticket from incoming folder
 * @param {string} ticketId - Ticket ID to load
 * @returns {Promise<Object>} Ticket data
 */
export const loadTicket = async (ticketId) => {
  try {
    // Get files from incoming folder
    const files = await getIncomingFiles();

    // For demo, return Vee Engineering ticket
    if (ticketId === '13690386' || !ticketId) {
      const ticketData = loadVeeEngineeringTicket();

      // Load customer history
      const customerHistory = await getCustomerFile(ticketData.webEdiId);
      if (customerHistory) {
        ticketData.customerHistory = customerHistory;
      }

      // Load trading partner specs
      const partnerSpecs = await getTradingPartnerSpecs('John Deere');
      if (partnerSpecs) {
        ticketData.tradingPartnerSpecs = partnerSpecs;
      }

      return ticketData;
    }

    return null;
  } catch (error) {
    console.error('Error loading ticket:', error);
    return null;
  }
};

/**
 * Calculate complexity score from ticket data
 * @param {Object} ticketData - Ticket data
 * @returns {Object} Complexity assessment
 */
export const calculateComplexity = (ticketData) => {
  let errorClarity = 0; // Clear error code identified
  let systemScope = 1; // Dual systems (GlobalShop + John Deere)
  let patternRecognition = 1; // Similar pattern exists
  let customerHistory = 1; // New issue, known customer

  const totalScore = errorClarity + systemScope + patternRecognition + customerHistory;

  let level = 'L0';
  let questions = 3;
  let queries = 1;
  let estimatedTime = '30s';
  let strategy = 'Single compound query';

  if (totalScore >= 3 && totalScore <= 4) {
    level = 'L1';
    questions = 5;
    queries = 2;
    estimatedTime = '45s';
    strategy = 'Primary + diagnostic queries';
  } else if (totalScore >= 5 && totalScore <= 6) {
    level = 'L2';
    questions = 6;
    queries = 2;
    estimatedTime = '60s';
    strategy = 'Root cause + diagnostics';
  } else if (totalScore >= 7) {
    level = 'L3';
    questions = 8;
    queries = 2;
    estimatedTime = '60s';
    strategy = 'Systemic + escalation';
  }

  return {
    score: totalScore,
    maxScore: 8,
    level,
    factors: {
      errorClarity: { score: errorClarity, max: 2, description: 'Clear error code identified' },
      systemScope: { score: systemScope, max: 2, description: 'Dual systems involved (GlobalShop + John Deere)' },
      patternRecognition: { score: patternRecognition, max: 2, description: 'Similar pattern exists in knowledge base' },
      customerHistory: { score: customerHistory, max: 2, description: 'New issue, known customer' }
    },
    investigationStrategy: {
      questions,
      queries,
      estimatedTime,
      strategy
    }
  };
};

/**
 * Get customer responses
 * @param {Object} ticketData - Ticket data
 * @param {string} engineerName - Support engineer name
 * @returns {Object} Customer responses
 */
export const generateCustomerResponses = (ticketData, engineerName = 'Michael Hoang') => {
  const initialResponse = `Hi ${ticketData.customerName},

My name is ${engineerName}, Cleo support engineer. I've received your ticket about the John Deere ASN rejection issue for part AXE21152. Let me take a look at what's going on with your ASN formatting. I'll get back to you shortly with my findings.

Best regards,
${engineerName}
Cleo Support Engineer`;

  const followUpResponse = `Hi ${ticketData.customerName},

I've identified the issue causing John Deere to show "No ASN" for your shipments. The problem is in how the line item information is being formatted in your 856 ASN documents.

John Deere's system requires the line item data in a very specific format, and currently three fields are not matching their requirements:

1. Line identification field - Your system is sending a line sequence number (153), but John Deere's specification requires this field to be left blank.

2. Purchase Order line number - Your system is currently sending "0164" (which appears to be an internal reference number), but John Deere needs the actual PO line number from their purchase order (in this case, "00010").

3. Extra information - Your system is including country of origin data (CH*US) in the line item section, which John Deere's format doesn't expect.

You'll need to adjust your GlobalShop EDI mapping configuration for John Deere ASN transactions:

1. Remove the line sequence number from the first position of the line item record
2. Update the data source for the PO line number field to pull from the actual John Deere purchase order line number
3. Remove the country of origin from the line item section

Current Format (being rejected):
LIN*153*BP*AXE21152*PL*0164*CH*US

Required Format (will be accepted):
LIN**BP*AXE21152*PL*00010

Next steps:
1. Work with your GlobalShop administrator to make these configuration changes
2. Make sure your system is capturing the PO line number from John Deere's incoming purchase orders (850 documents)
3. Generate a test ASN to verify the format is correct
4. Resubmit the ASN for Invoice 385462, Part AXE21152

If you need assistance with the specific mapping changes in GlobalShop, please let us know and we can provide more detailed technical guidance.

Best regards,
${engineerName}
Cleo Support Engineer`;

  return {
    initial: initialResponse,
    followUp: followUpResponse
  };
};

export default {
  loadTicket,
  loadVeeEngineeringTicket,
  calculateComplexity,
  generateCustomerResponses
};
