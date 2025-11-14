const fs = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');

class FileSystemManager {
  constructor(ticketsBasePath) {
    this.basePath = ticketsBasePath;
    this.incomingPath = path.join(ticketsBasePath, 'incoming');
    this.resolutionPath = path.join(ticketsBasePath, 'resolution');
    this.customersPath = path.join(ticketsBasePath, 'customers');
    this.tradingPartnersPath = path.join(ticketsBasePath, 'Trading_Partners');
    this.watcher = null;
  }

  // Watch incoming folder for new files
  watchIncoming(callback) {
    try {
      this.watcher = chokidar.watch(this.incomingPath, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        ignoreInitial: false,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval: 100
        }
      });

      this.watcher.on('add', filepath => {
        console.log(`[FileSystemManager] File added: ${filepath}`);
        callback({ event: 'file_added', filepath });
      });

      this.watcher.on('change', filepath => {
        console.log(`[FileSystemManager] File changed: ${filepath}`);
        callback({ event: 'file_changed', filepath });
      });

      console.log(`[FileSystemManager] Watching: ${this.incomingPath}`);
    } catch (error) {
      console.error('[FileSystemManager] Watch error:', error.message);
    }
  }

  // Get all files in incoming folder
  async getIncomingFiles() {
    try {
      const files = await fs.readdir(this.incomingPath);
      const fileDetails = [];

      for (const file of files) {
        const filePath = path.join(this.incomingPath, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile()) {
          fileDetails.push({
            name: file,
            path: filePath,
            directory: this.incomingPath,
            size: stats.size,
            modified: stats.mtime,
            extension: path.extname(file)
          });
        }
      }

      return fileDetails;
    } catch (error) {
      console.error('[FileSystemManager] Get incoming files error:', error.message);
      return [];
    }
  }

  // Get folder statistics
  async getFolderStats() {
    const stats = {
      incoming: 0,
      processing: 0,
      customers: 0,
      tradingPartners: 0,
      resolution: 0
    };

    try {
      // Count incoming files
      const incomingFiles = await fs.readdir(this.incomingPath);
      stats.incoming = incomingFiles.filter(f => !f.startsWith('.')).length;

      // Count customer files
      const customerFiles = await fs.readdir(this.customersPath);
      stats.customers = customerFiles.filter(f => f.endsWith('.md')).length;

      // Count trading partner folders
      const tradingPartnerFolders = await fs.readdir(this.tradingPartnersPath);
      stats.tradingPartners = tradingPartnerFolders.filter(async f => {
        const stat = await fs.stat(path.join(this.tradingPartnersPath, f));
        return stat.isDirectory();
      }).length;

      // Count resolution folders
      const resolutionFolders = await fs.readdir(this.resolutionPath);
      stats.resolution = resolutionFolders.filter(async f => {
        const stat = await fs.stat(path.join(this.resolutionPath, f));
        return stat.isDirectory();
      }).length;

    } catch (error) {
      console.error('[FileSystemManager] Get folder stats error:', error.message);
    }

    return stats;
  }

  // Move file to resolution folder
  async moveToResolution(ticketId, webEdiId, companyName, fileName) {
    try {
      const customerFolder = `${webEdiId}_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const destFolder = path.join(this.resolutionPath, customerFolder);

      // Create folder if doesn't exist
      await fs.mkdir(destFolder, { recursive: true });

      const sourcePath = path.join(this.incomingPath, fileName);
      const ext = path.extname(fileName);
      const destPath = path.join(destFolder, `ticket_${ticketId}${ext}`);

      // Move file
      await fs.rename(sourcePath, destPath);

      console.log(`[FileSystemManager] Moved: ${fileName} -> ${destPath}`);
      return destPath;

    } catch (error) {
      console.error('[FileSystemManager] Move file error:', error.message);
      throw error;
    }
  }

  // Save investigation report
  async saveInvestigation(ticketId, webEdiId, companyName, content) {
    try {
      const customerFolder = `${webEdiId}_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const destFolder = path.join(this.resolutionPath, customerFolder);
      await fs.mkdir(destFolder, { recursive: true });

      const filePath = path.join(destFolder, `investigation_${ticketId}.md`);
      await fs.writeFile(filePath, content, 'utf-8');

      console.log(`[FileSystemManager] Saved investigation: ${filePath}`);
      return filePath;

    } catch (error) {
      console.error('[FileSystemManager] Save investigation error:', error.message);
      throw error;
    }
  }

  // Save customer response
  async saveResponse(ticketId, webEdiId, companyName, content) {
    try {
      const customerFolder = `${webEdiId}_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const destFolder = path.join(this.resolutionPath, customerFolder);
      await fs.mkdir(destFolder, { recursive: true });

      const filePath = path.join(destFolder, `response_${ticketId}.md`);
      await fs.writeFile(filePath, content, 'utf-8');

      console.log(`[FileSystemManager] Saved response: ${filePath}`);
      return filePath;

    } catch (error) {
      console.error('[FileSystemManager] Save response error:', error.message);
      throw error;
    }
  }

  // Get customer history
  async getCustomerHistory(webEdiId) {
    try {
      const files = await fs.readdir(this.customersPath);
      const customerFile = files.find(f => f.startsWith(`${webEdiId}_`));

      if (!customerFile) {
        console.log(`[FileSystemManager] No history found for WebEDI ID: ${webEdiId}`);
        return null;
      }

      const content = await fs.readFile(
        path.join(this.customersPath, customerFile),
        'utf-8'
      );

      console.log(`[FileSystemManager] Loaded customer history: ${customerFile}`);
      return content;

    } catch (error) {
      console.error('[FileSystemManager] Get customer history error:', error.message);
      return null;
    }
  }

  // Get trading partner specs
  async getTradingPartnerSpecs(partnerName) {
    try {
      // Normalize partner name
      const normalizedName = partnerName.replace(/[^a-zA-Z0-9\s]/g, '').trim();

      // Try to find matching folder
      const folders = await fs.readdir(this.tradingPartnersPath);
      const matchingFolder = folders.find(f =>
        f.toLowerCase().includes(normalizedName.toLowerCase())
      );

      if (!matchingFolder) {
        console.log(`[FileSystemManager] No specs found for partner: ${partnerName}`);
        return null;
      }

      const partnerFolder = path.join(this.tradingPartnersPath, matchingFolder);
      const files = await fs.readdir(partnerFolder);

      const specs = {};
      for (const file of files) {
        if (file.endsWith('.pdf') || file.endsWith('.md') || file.endsWith('.txt')) {
          specs[file] = path.join(partnerFolder, file);
        }
      }

      console.log(`[FileSystemManager] Loaded trading partner specs: ${matchingFolder}`);
      return specs;

    } catch (error) {
      console.error('[FileSystemManager] Get trading partner specs error:', error.message);
      return null;
    }
  }

  // Update customer history
  async updateCustomerHistory(webEdiId, companyName, ticketData) {
    try {
      const files = await fs.readdir(this.customersPath);
      let customerFile = files.find(f => f.startsWith(`${webEdiId}_`));

      if (!customerFile) {
        // Create new customer file
        customerFile = `${webEdiId}_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
        const initialContent = `# ${companyName} (WebEDI ID: ${webEdiId})\n\n## Contact Information\n\n## Ticket History\n\n`;
        await fs.writeFile(
          path.join(this.customersPath, customerFile),
          initialContent,
          'utf-8'
        );
      }

      // Append ticket data
      const timestamp = new Date().toISOString().split('T')[0];
      const ticketEntry = `### Ticket #${ticketData.ticketId} - ${timestamp}\n**Issue:** ${ticketData.error || 'N/A'}\n**Status:** Resolved\n\n`;

      await fs.appendFile(
        path.join(this.customersPath, customerFile),
        ticketEntry,
        'utf-8'
      );

      console.log(`[FileSystemManager] Updated customer history: ${customerFile}`);

    } catch (error) {
      console.error('[FileSystemManager] Update customer history error:', error.message);
    }
  }

  // Get support engineer name
  async getSupportEngineerName() {
    try {
      const nameFile = path.join(this.basePath, '.support_engineer_name');
      const name = await fs.readFile(nameFile, 'utf-8');
      return name.trim();
    } catch {
      return 'Support Team';
    }
  }

  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      console.log('[FileSystemManager] Stopped watching incoming folder');
    }
  }
}

module.exports = { FileSystemManager };
