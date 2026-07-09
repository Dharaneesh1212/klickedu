import cron from 'node-cron';
import Lead from '../models/Lead.js';

export const startCronJobs = () => {
  // Run every minute during development to test, or every day at midnight in production:
  // "0 0 * * *" for production, "* * * * *" for dev. Using every minute as requested.
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Running Auto Follow-up Reminder Automation...');
      const currentDate = new Date();
      
      // Find leads that are overdue, not yet marked as overdue, and not in terminal stages/statuses
      const overdueLeads = await Lead.find({
        nextFollowUpDate: { $lt: currentDate, $ne: null },
        isOverdue: { $ne: true },
        stage: { $nin: ['Converted', 'Lost'] },
        status: { $nin: ['Converted', 'Lost'] }
      });

      if (overdueLeads.length > 0) {
        for (const lead of overdueLeads) {
          lead.isOverdue = true;
          lead.activities.push({
            action: 'Automatic Follow-up Reminder Generated',
            details: `Lead follow-up was scheduled for ${lead.nextFollowUpDate.toDateString()} and is now overdue.`,
            date: new Date()
          });
          await lead.save();
        }
        console.log(`Marked ${overdueLeads.length} leads as overdue.`);
      }
    } catch (error) {
      console.error('Error in Auto Follow-up Reminder Cron Job:', error);
    }
  });
};
