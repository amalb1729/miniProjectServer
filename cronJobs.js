const cron = require('node-cron');
const { cancelAllPendingOrders } = require('./controllers/orderController');

// Configure cron job to run at 4:00 PM IST every day
// Format: second(optional) minute hour day-of-month month day-of-week
const scheduleCronJobs = () => {
  // Schedule the job to run at 4:00 PM IST (10:30 UTC)
  cron.schedule('0 16 * * *', async () => {
    console.log('Running scheduled job: Cancel all pending orders at 4:00 PM IST');
    try {
      // Create a mock request and response object for the controller
      const req = {};
      const res = {
        json: (data) => {
          console.log('Cron job result:', data);
        },
        status: (statusCode) => {
          console.log('Cron job status:', statusCode);
          return {
            json: (data) => {
              console.log('Cron job error:', data);
            }
          };
        }
      };
      
      // Call the existing controller function
      await cancelAllPendingOrders(req, res);
      console.log('Scheduled job completed: All pending orders cancelled');
    } catch (error) {
      console.error('Error in scheduled job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Set to Indian timezone
  });
  
  console.log('Cron jobs scheduled successfully');
};

module.exports = { scheduleCronJobs };
