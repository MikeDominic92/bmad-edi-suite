const { WebSocketServer } = require('ws');
const { FileProcessor } = require('./file-processor');
const { FileSystemManager } = require('./file-system-manager');
const fs = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');

/**
 * BMAD-EDI Investigation Engine v2.1 - Trigger-Based
 *
 * Instead of using Claude SDK directly, this engine creates trigger files
 * that Claude Code (running in VS Code) watches and auto-executes /bmadedi
 *
 * Flow:
 * 1. App calls startInvestigation()
 * 2. Engine creates .trigger file with ticket metadata
 * 3. Claude Code hook detects trigger
 * 4. Claude Code auto-runs /bmadedi command
 * 5. /bmadedi creates investigation files in resolution/
 * 6. Engine watches for completion and broadcasts progress
 * 7. App displays final results
 */
class InvestigationEngineTrigger {
  constructor(config) {
    this.wss = null;
    this.fileProcessor = null;
    this.fileSystemManager = null;
    this.currentPhase = 0;
    this.investigationState = {};
    this.isPaused = false;
    this.triggerDir = path.join(config.ticketsBasePath || process.env.TICKETS_BASE_PATH, '.triggers');
    this.resultWatcher = null;
  }

  async initialize() {
    // Initialize WebSocket server for real-time updates
    this.wss = new WebSocketServer({ port: 8080 });
    this.wss.on('connection', (ws) => {
      console.log('[BMAD-EDI] Frontend connected to investigation stream');
      ws.send(JSON.stringify({
        type: 'CONNECTED',
        message: 'Investigation engine ready (Trigger mode - uses Claude Code)'
      }));
    });

    // Initialize file processor
    this.fileProcessor = new FileProcessor();
    await this.fileProcessor.initialize();

    // Initialize file system manager
    this.fileSystemManager = new FileSystemManager(process.env.TICKETS_BASE_PATH);

    // Create trigger directory
    await fs.mkdir(this.triggerDir, { recursive: true });

    console.log('[BMAD-EDI] Investigation engine initialized (Trigger-based mode)');
    console.log('[BMAD-EDI] Trigger directory:', this.triggerDir);
    console.log('[BMAD-EDI] Waiting for Claude Code to execute investigations...');
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

  /**
   * Execute investigation by creating trigger file for Claude Code
   */
  async executeInvestigation(ticketId) {
    try {
      this.broadcastProgress(0, {
        status: 'starting',
        message: 'BMAD-EDI v2.1 - Trigger-Based Mode: Preparing investigation...',
        ticketId
      });

      // Get incoming files
      const incomingFiles = await this.fileSystemManager.getIncomingFiles();

      if (incomingFiles.length === 0) {
        throw new Error('No files found in incoming folder');
      }

      // Process files to extract basic metadata
      this.broadcastProgress(0, {
        status: 'processing',
        message: 'Processing ticket files...'
      });

      const processedFiles = await this.fileProcessor.processTicketFiles(
        path.dirname(incomingFiles[0].path)
      );

      // Extract basic info for trigger
      const ticketInfo = this.extractBasicInfo(processedFiles);

      // Create trigger file for Claude Code
      this.broadcastProgress(0, {
        status: 'triggering',
        message: 'Creating trigger for Claude Code...'
      });

      const triggerData = {
        ticketId: ticketInfo.ticketId || ticketId || 'unknown',
        webEdiId: ticketInfo.webEdiId || 'unknown',
        companyName: ticketInfo.companyName || 'Unknown Company',
        files: processedFiles.filesFound,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      const triggerFile = path.join(this.triggerDir, `${triggerData.ticketId}.trigger`);
      await fs.writeFile(triggerFile, JSON.stringify(triggerData, null, 2));

      console.log('[BMAD-EDI] Trigger created:', triggerFile);
      console.log('[BMAD-EDI] Waiting for Claude Code to detect trigger and run /bmadedi...');

      this.broadcastProgress(0, {
        status: 'waiting',
        message: 'Waiting for Claude Code to execute /bmadedi...',
        triggerFile: triggerFile
      });

      // Watch for completion
      const result = await this.watchForCompletion(triggerData);

      this.broadcastProgress(9, {
        status: 'complete',
        message: 'Investigation completed by Claude Code!',
        output: result
      });

      return result;

    } catch (error) {
      this.broadcastProgress(-1, { status: 'error', error: error.message });
      throw error;
    }
  }

  /**
   * Extract basic ticket info from processed files
   */
  extractBasicInfo(processedFiles) {
    const allText = (processedFiles.pdfContent || '') +
                    (processedFiles.htmlContent || '') +
                    (processedFiles.imageContent || '');

    // Try to extract ticket ID, WebEDI ID, company name using simple regex
    const ticketIdMatch = allText.match(/(?:ticket|case|#)\s*[:#]?\s*(\d+)/i);
    const webEdiIdMatch = allText.match(/(?:webedi|customer)\s*(?:id|#)?\s*[:#]?\s*(\d+)/i);
    const companyMatch = allText.match(/(?:company|customer|client)\s*[:#]?\s*([A-Za-z\s&.,'-]+?)(?:\n|$)/i);

    return {
      ticketId: ticketIdMatch ? ticketIdMatch[1] : null,
      webEdiId: webEdiIdMatch ? webEdiIdMatch[1] : null,
      companyName: companyMatch ? companyMatch[1].trim() : null
    };
  }

  /**
   * Watch for investigation completion
   * Monitors resolution folder for new investigation files
   */
  async watchForCompletion(triggerData, timeout = 600000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let phaseUpdateInterval;

      // Simulate phase progression while waiting
      phaseUpdateInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const estimatedPhase = Math.min(8, Math.floor(elapsed / 60000)); // ~1 min per phase

        if (estimatedPhase > this.currentPhase) {
          this.currentPhase = estimatedPhase;
          this.broadcastProgress(estimatedPhase, {
            status: 'running',
            message: `Claude Code executing Phase ${estimatedPhase}...`,
            elapsed: Math.floor(elapsed / 1000)
          });
        }
      }, 10000); // Check every 10 seconds

      // Watch for completion file or investigation files
      const completionFile = path.join(this.triggerDir, `${triggerData.ticketId}.complete`);
      const resolutionFolder = path.join(
        process.env.TICKETS_BASE_PATH,
        'resolution',
        `${triggerData.webEdiId}_${triggerData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}`
      );

      const checkCompletion = async () => {
        // Check for .complete file
        try {
          if (await this.fileExists(completionFile)) {
            const completionData = JSON.parse(await fs.readFile(completionFile, 'utf-8'));
            clearInterval(phaseUpdateInterval);
            resolve(completionData);
            return;
          }
        } catch (e) {}

        // Check for investigation files in resolution folder
        try {
          const files = await fs.readdir(resolutionFolder);
          const hasInvestigation = files.some(f => f.startsWith('investigation_'));
          const hasResponse = files.some(f => f.startsWith('response_'));

          if (hasInvestigation && hasResponse) {
            // Investigation complete! Read the files
            const investigationFile = files.find(f => f.startsWith('investigation_'));
            const responseFile = files.find(f => f.startsWith('response_'));

            const investigation = await fs.readFile(
              path.join(resolutionFolder, investigationFile),
              'utf-8'
            );
            const response = await fs.readFile(
              path.join(resolutionFolder, responseFile),
              'utf-8'
            );

            clearInterval(phaseUpdateInterval);
            resolve({
              status: 'complete',
              ticketId: triggerData.ticketId,
              investigation,
              response,
              files: files
            });
            return;
          }
        } catch (e) {}

        // Timeout check
        if (Date.now() - startTime > timeout) {
          clearInterval(phaseUpdateInterval);
          reject(new Error('Investigation timeout - Claude Code may not have detected trigger'));
        }
      };

      // Check every 5 seconds
      const watcher = setInterval(checkCompletion, 5000);
      checkCompletion(); // Initial check

      // Cleanup on timeout
      setTimeout(() => {
        clearInterval(watcher);
        clearInterval(phaseUpdateInterval);
      }, timeout);
    });
  }

  /**
   * Helper: Check if file exists
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async cleanup() {
    if (this.fileProcessor) {
      await this.fileProcessor.cleanup();
    }
    if (this.wss) {
      this.wss.close();
    }
    if (this.resultWatcher) {
      this.resultWatcher.close();
    }
  }
}

module.exports = { InvestigationEngineTrigger };
