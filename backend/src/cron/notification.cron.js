import cron from "node-cron";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";

// Runs every day at 9 AM
export const startNotificationCron = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log(" Running notification cron job");

    try {
      const dueTransactions = await Transaction.find({
        status: "Due",
      });

      for (const tx of dueTransactions) {
        await Notification.create({
          user: tx.createdBy,
          title: "Payment Due",
          message: "You have a pending payment due.",
        });
      }

      console.log(
        ` Notifications created for ${dueTransactions.length} transactions`
      );
    } catch (error) {
      console.error("Cron error:", error.message);
    }
  });
};
