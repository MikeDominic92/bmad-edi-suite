const Anthropic = require('@anthropic-ai/sdk').default;
const { WebSocketServer } = require('ws');
const { FileProcessor } = require('./file-processor');
const { NotebookLMClient } = require('./notebooklm-client');
const { FileSystemManager } = require('./file-system-manager');

class InvestigationEngine {
  constructor(config) {
    this.anthropic = new Anthropic({
      apiKey: config.apiKey
    });
    this.notebookUrl = config.notebookUrl;
    this.wss = null;
    this.fileProcessor = null;
    this.notebookLM = null;
    this.fileSystemManager = null;
    this.currentPhase = 0;
    this.investigationState = {};
    this.isPaused = false;
  }

  async initialize() {
    // Initialize WebSocket server for real-time updates
    this.wss = new WebSocketServer({ port: 8080 });
    this.wss.on('connection', (ws) => {
      console.log('[BMAD-EDI] Frontend connected to investigation stream');
      ws.send(JSON.stringify({
        type: 'CONNECTED',
        message: 'Investigation engine ready'
      }));
    });

    // Initialize file processor
    this.fileProcessor = new FileProcessor();
    await this.fileProcessor.initialize();

    // Initialize NotebookLM client
    this.notebookLM = new NotebookLMClient(this.notebookUrl);
    await this.notebookLM.initialize();

    console.log('[BMAD-EDI] Investigation engine initialized');
  }

  // Broadcast progress to React frontend
  broadcastProgress(phase, data) {
    if (!this.wss) return;

    const message = {
      type: 'PHASE_UPDATE',
      phase,
      data,
      timestamp: new Date().toISOString()
    };

    this.wss.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(JSON.stringify(message));
      }
    });

    console.log(`[BMAD-EDI] Phase ${phase} update:`, data.status || data.message);
  }

  pause() {
    this.isPaused = true;
    this.broadcastProgress(this.currentPhase, { status: 'paused' });
  }

  resume() {
    this.isPaused = false;
    this.broadcastProgress(this.currentPhase, { status: 'resumed' });
  }

  // Execute full 9-phase investigation
  async executeInvestigation(ticketId) {
    try {
      this.broadcastProgress(0, {
        status: 'starting',
        message: 'BMAD-EDI Investigation Suite v5.1 - Starting investigation...',
        ticketId
      });

      // Get incoming files
      this.fileSystemManager = new FileSystemManager(process.env.TICKETS_BASE_PATH);
      const incomingFiles = await this.fileSystemManager.getIncomingFiles();

      if (incomingFiles.length === 0) {
        throw new Error('No files found in incoming folder');
      }

      // Phase 1: Ticket Extraction (Analyst)
      this.currentPhase = 1;
      this.broadcastProgress(1, { status: 'running', agent: 'Analyst' });
      const extraction = await this.phase1_extraction(incomingFiles);
      this.broadcastProgress(1, { status: 'complete', data: extraction });

      if (this.isPaused) await this.waitForResume();

      // Phase 2: Customer History Review (Analyst)
      this.currentPhase = 2;
      this.broadcastProgress(2, { status: 'running', agent: 'Analyst' });
      const history = await this.phase2_customerHistory(extraction);
      this.broadcastProgress(2, { status: 'complete', data: history });

      if (this.isPaused) await this.waitForResume();

      // Phase 3: Trading Partner Check (PM-Investigator)
      this.currentPhase = 3;
      this.broadcastProgress(3, { status: 'running', agent: 'PM-Investigator' });
      const partnerSpecs = await this.phase3_tradingPartner(extraction);
      this.broadcastProgress(3, { status: 'complete', data: partnerSpecs });

      if (this.isPaused) await this.waitForResume();

      // Phase 4: Complexity Assessment (PM-Investigator)
      this.currentPhase = 4;
      this.broadcastProgress(4, { status: 'running', agent: 'PM-Investigator' });
      const complexity = await this.phase4_complexity(extraction, history);
      this.broadcastProgress(4, { status: 'complete', data: complexity });

      if (this.isPaused) await this.waitForResume();

      // Phase 5: Investigation Planning (PM-Investigator)
      this.currentPhase = 5;
      this.broadcastProgress(5, { status: 'running', agent: 'PM-Investigator' });
      const plan = await this.phase5_planning(complexity);
      this.broadcastProgress(5, { status: 'complete', data: plan });

      if (this.isPaused) await this.waitForResume();

      // Phase 6: Investigation Execution (Investigator)
      this.currentPhase = 6;
      this.broadcastProgress(6, { status: 'running', agent: 'Investigator' });
      const findings = await this.phase6_execution(plan, extraction);
      this.broadcastProgress(6, { status: 'complete', data: findings });

      if (this.isPaused) await this.waitForResume();

      // Phase 7: Root Cause Synthesis (Investigator)
      this.currentPhase = 7;
      this.broadcastProgress(7, { status: 'running', agent: 'Investigator' });
      const rootCause = await this.phase7_synthesis(findings);
      this.broadcastProgress(7, { status: 'complete', data: rootCause });

      if (this.isPaused) await this.waitForResume();

      // Phase 8: Customer Response & File Organization (Documentation Specialist)
      this.currentPhase = 8;
      this.broadcastProgress(8, { status: 'running', agent: 'Documentation Specialist' });
      const response = await this.phase8_documentation(rootCause, extraction);
      this.broadcastProgress(8, { status: 'complete', data: response });

      if (this.isPaused) await this.waitForResume();

      // Phase 9: QA Validation (QA-Validator)
      this.currentPhase = 9;
      this.broadcastProgress(9, { status: 'running', agent: 'QA-Validator' });
      const finalOutput = await this.phase9_validation(response, extraction);
      this.broadcastProgress(9, { status: 'complete', output: finalOutput });

      return finalOutput;

    } catch (error) {
      this.broadcastProgress(-1, { status: 'error', error: error.message });
      throw error;
    }
  }

  async waitForResume() {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (!this.isPaused) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 500);
    });
  }

  // Phase 1: Ticket Extraction using Claude
  async phase1_extraction(incomingFiles) {
    // Process all files in incoming folder
    const processedFiles = await this.fileProcessor.processTicketFiles(
      incomingFiles[0].directory
    );

    const systemPrompt = `You are the Analyst Agent in the BMAD-EDI v5.1 system.

**PHASE 1: TICKET EXTRACTION**

Extract ticket information from provided files and output in clean, copy-paste ready format.

**Extract:**
• Ticket ID
• Customer WebEDI ID
• Company Name
• Primary Contact Name
• Email
• Trading Partner Name
• Document Type (850, 856, 810, etc.)
• Error Reported
• Date Submitted

**Format:**
Use bullet points (•) for clean output.
NO emojis. Use plain text markers: [+], [!], [*]

**Output Template:**
[TICKET EXTRACTION]
• Ticket ID: [value]
• WebEDI ID: [value]
• Company: [value]
• Contact: [name] ([email])
• Trading Partner: [value]
• Document Type: [value]
• Error: [description]
• Submitted: [date]`;

    const userPrompt = `Extract ticket metadata from these files:

**PDF Content:**
${processedFiles.pdfContent || 'No PDF content'}

**HTML Content:**
${processedFiles.htmlContent || 'No HTML content'}

**Image Content (OCR):**
${processedFiles.imageContent || 'No image content'}`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    });

    const extractionText = message.content[0].text;

    return {
      ticketId: this.extractField(extractionText, 'Ticket ID'),
      webEdiId: this.extractField(extractionText, 'WebEDI ID'),
      companyName: this.extractField(extractionText, 'Company'),
      contact: this.extractField(extractionText, 'Contact'),
      tradingPartner: this.extractField(extractionText, 'Trading Partner'),
      documentType: this.extractField(extractionText, 'Document Type'),
      error: this.extractField(extractionText, 'Error'),
      submittedDate: this.extractField(extractionText, 'Submitted'),
      fullExtraction: extractionText,
      filesProcessed: processedFiles.filesFound
    };
  }

  // Phase 2: Customer History Review
  async phase2_customerHistory(extraction) {
    const customerHistory = await this.fileSystemManager.getCustomerHistory(
      extraction.webEdiId
    );

    const systemPrompt = `You are the Analyst Agent in the BMAD-EDI v5.1 system.

**PHASE 2: CUSTOMER HISTORY REVIEW**

Analyze customer history to identify patterns, recurring issues, and context.

**Output Format:**
[CUSTOMER HISTORY]
• Previous Tickets: [count]
• Common Issues: [list]
• Pattern Recognition: [analysis]
• Risk Assessment: [Low/Medium/High]`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Analyze customer history:\n\n${customerHistory || 'No previous history found'}\n\nCurrent ticket: ${extraction.fullExtraction}`
      }]
    });

    return {
      analysis: message.content[0].text,
      hasHistory: !!customerHistory,
      rawHistory: customerHistory
    };
  }

  // Phase 3: Trading Partner Check
  async phase3_tradingPartner(extraction) {
    const partnerSpecs = await this.fileSystemManager.getTradingPartnerSpecs(
      extraction.tradingPartner
    );

    const systemPrompt = `You are the PM-Investigator Agent in the BMAD-EDI v5.1 system.

**PHASE 3: TRADING PARTNER CHECK**

Verify trading partner specifications and requirements.

**Output Format:**
[TRADING PARTNER CHECK]
• Partner: [name]
• Specs Available: [Yes/No]
• Document Type: [value]
• Known Requirements: [list]`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Check trading partner specs:\n\nPartner: ${extraction.tradingPartner}\nDocument: ${extraction.documentType}\n\nSpecs: ${partnerSpecs ? 'Available' : 'Not found'}`
      }]
    });

    return {
      analysis: message.content[0].text,
      specsFound: !!partnerSpecs,
      specFiles: partnerSpecs
    };
  }

  // Phase 4: Complexity Assessment
  async phase4_complexity(extraction, history) {
    const systemPrompt = `You are the PM-Investigator Agent in the BMAD-EDI v5.1 system.

**PHASE 4: COMPLEXITY ASSESSMENT**

Calculate complexity score (0-8) using 4-factor system:
1. Error Clarity (0-2): Is error message clear and specific?
2. System Scope (0-2): Single system or multiple systems?
3. Pattern Recognition (0-2): Known pattern or new issue?
4. Customer History (0-2): First-time or repeat customer?

**Output Format:**
[COMPLEXITY ASSESSMENT]
• Error Clarity: [0-2] - [reason]
• System Scope: [0-2] - [reason]
• Pattern Recognition: [0-2] - [reason]
• Customer History: [0-2] - [reason]
• Total Score: [0-8]
• Complexity Level: [L1/L2/L3]
• Adaptive Questions: [2-8 based on score]`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Calculate complexity:\n\nTicket: ${extraction.fullExtraction}\n\nHistory: ${history.analysis}`
      }]
    });

    const complexityText = message.content[0].text;
    const scoreMatch = complexityText.match(/Total Score: (\d)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 3;

    return {
      score,
      level: score <= 2 ? 'L1' : score <= 5 ? 'L2' : 'L3',
      adaptiveQuestions: Math.max(2, Math.min(8, score)),
      analysis: complexityText
    };
  }

  // Phase 5: Investigation Planning
  async phase5_planning(complexity) {
    const systemPrompt = `You are the PM-Investigator Agent in the BMAD-EDI v5.1 system.

**PHASE 5: INVESTIGATION PLANNING**

Generate ${complexity.adaptiveQuestions} adaptive questions for NotebookLM WebEDI KB.

**Rules:**
- Questions MUST start with "Using ONLY WebEDI Knowledge Base sources:"
- Focus on root cause identification
- Technical accuracy required
- No assumptions

**Output Format:**
[INVESTIGATION PLAN]
${Array(complexity.adaptiveQuestions).fill('• Q[N]: Using ONLY WebEDI Knowledge Base sources: [question]').join('\n')}`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Create investigation plan with ${complexity.adaptiveQuestions} questions based on:\n\n${complexity.analysis}`
      }]
    });

    const planText = message.content[0].text;
    const questions = this.extractQuestions(planText);

    return {
      questions,
      questionCount: complexity.adaptiveQuestions,
      plan: planText
    };
  }

  // Phase 6: Investigation Execution (NotebookLM Queries)
  async phase6_execution(plan, extraction) {
    const findings = [];

    for (const question of plan.questions) {
      try {
        const result = await this.notebookLM.queryWebEDIKB(question);
        findings.push({
          question,
          answer: result.response,
          citations: result.citations,
          confidence: result.confidence
        });

        // Broadcast each finding in real-time
        this.broadcastProgress(6, {
          status: 'finding',
          question,
          answer: result.response.substring(0, 200) + '...'
        });

      } catch (error) {
        findings.push({
          question,
          error: error.message,
          confidence: 0
        });
      }
    }

    return {
      findings,
      totalQuestions: plan.questions.length,
      avgConfidence: findings.reduce((sum, f) => sum + (f.confidence || 0), 0) / findings.length
    };
  }

  // Phase 7: Root Cause Synthesis
  async phase7_synthesis(findings) {
    const systemPrompt = `You are the Investigator Agent in the BMAD-EDI v5.1 system.

**PHASE 7: ROOT CAUSE SYNTHESIS**

Synthesize findings into clear root cause analysis.

**Output Format:**
[ROOT CAUSE ANALYSIS]
• Root Cause: [clear statement]
• Evidence: [list findings]
• Confidence: [0.00-1.00]
• Citations: [list sources]`;

    const findingsText = findings.findings.map((f, i) =>
      `Q${i+1}: ${f.question}\nA${i+1}: ${f.answer || f.error}\nConfidence: ${f.confidence || 0}\n`
    ).join('\n');

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Synthesize root cause from findings:\n\n${findingsText}`
      }]
    });

    return {
      rootCause: message.content[0].text,
      confidence: findings.avgConfidence,
      findingsCount: findings.findings.length
    };
  }

  // Phase 8: Customer Response & File Organization
  async phase8_documentation(rootCause, extraction) {
    const engineerName = await this.fileSystemManager.getSupportEngineerName();

    const systemPrompt = `You are the Documentation Specialist Agent in the BMAD-EDI v5.1 system.

**PHASE 8: CUSTOMER RESPONSE & FILE ORGANIZATION**

Generate professional customer response with copy-paste ready format.

**Output Format:**
[CUSTOMER RESPONSE]

Hi [Contact Name],

[Professional response with root cause and solution]

[Technical details if needed]

Best regards,
${engineerName}
EDI Support Specialist`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Generate customer response:\n\nRoot Cause: ${rootCause.rootCause}\n\nCustomer: ${extraction.contact}\nTicket: ${extraction.ticketId}`
      }]
    });

    const response = message.content[0].text;

    // Save files
    await this.fileSystemManager.saveInvestigation(
      extraction.ticketId,
      extraction.webEdiId,
      extraction.companyName,
      `# Investigation #${extraction.ticketId}\n\n${rootCause.rootCause}`
    );

    await this.fileSystemManager.saveResponse(
      extraction.ticketId,
      extraction.webEdiId,
      extraction.companyName,
      response
    );

    // Move files to resolution folder
    const movedFiles = [];
    for (const file of extraction.filesProcessed) {
      const moved = await this.fileSystemManager.moveToResolution(
        extraction.ticketId,
        extraction.webEdiId,
        extraction.companyName,
        file.name
      );
      movedFiles.push(moved);
    }

    return {
      customerResponse: response,
      filesSaved: ['investigation', 'response'],
      filesMoved: movedFiles
    };
  }

  // Phase 9: QA Validation
  async phase9_validation(response, extraction) {
    const systemPrompt = `You are the QA-Validator Agent in the BMAD-EDI v5.1 system.

**PHASE 9: QA VALIDATION & FINAL OUTPUT**

Validate investigation completeness and generate final output.

**Checklist:**
[+] Ticket extracted correctly
[+] Customer history reviewed
[+] Trading partner verified
[+] Complexity assessed
[+] Investigation executed
[+] Root cause identified
[+] Customer response generated
[+] Files organized
[+] Citations verified

**Output Format:**
[QA VALIDATION - APPROVED]

BMAD-EDI Investigation Suite v5.1
Ticket #[ID] - [Company]

[Final copy-paste ready output with all details]`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Validate and generate final output:\n\nResponse: ${response.customerResponse}\n\nTicket: ${extraction.ticketId}`
      }]
    });

    return {
      approved: true,
      finalOutput: message.content[0].text,
      ticket: extraction.ticketId,
      completedAt: new Date().toISOString()
    };
  }

  // Helper methods
  extractField(text, fieldName) {
    const regex = new RegExp(`${fieldName}:?\\s*([^\\n•]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not found';
  }

  extractQuestions(text) {
    const questions = [];
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.includes('Using ONLY WebEDI Knowledge Base sources:')) {
        questions.push(line.replace(/^[•\-\*]\s*Q\d+:\s*/, '').trim());
      }
    }
    return questions;
  }

  async cleanup() {
    if (this.fileProcessor) {
      await this.fileProcessor.cleanup();
    }
    if (this.notebookLM) {
      await this.notebookLM.cleanup();
    }
    if (this.wss) {
      this.wss.close();
    }
  }
}

module.exports = { InvestigationEngine };
