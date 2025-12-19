import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startNotificationCron } from "./cron/notification.cron.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();
startNotificationCron();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
