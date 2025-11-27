import cron from 'node-cron';
import ReactivationService from '../services/reactivationService.js';

class ProfessionalScheduler {
  constructor() {
    this.job = null;
    this.isRunning = false;
    this.lastRun = null;
    this.lastResult = null;
  }

  start() {
    if (this.isRunning) return;

    this.job = cron.schedule('*/30 * * * *', () => {
      this.executeReactivation();
    }, { scheduled: false, timezone: 'UTC' });

    this.job.start();
    this.isRunning = true;
    // Initial check
    setTimeout(() => this.executeReactivation(), 3000);
  }

  stop() {
    if (this.job) {
      this.job.stop();
      this.isRunning = false;
    }
  }

  async executeReactivation() {
    const startTime = new Date();
    
    try {
      this.lastResult = await ReactivationService.reactivateDueProfessionals();
      this.lastRun = new Date();
    } catch (error) {
      console.error('Scheduler error:', error.message);
    }
  }

  async manualTrigger() {
    await this.executeReactivation();
  }

  getStatus() {
    return {
      is_running: this.isRunning,
      last_run: this.lastRun,
      last_result: this.lastResult,
      schedule: 'Every 30 minutes',
      timezone: 'UTC'
    };
  }
}

export default new ProfessionalScheduler();