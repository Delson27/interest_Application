import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import accountRoutes from "./routes/account.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/error.middleware.js";
import helmet from "helmet";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration for production
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? (
        process.env.FRONTEND_URL || "https://interest-application.vercel.app"
      ).split(",")
    : ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.some(
        (allowed) => origin === allowed || origin.startsWith(allowed),
      )
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(helmet()); // used to protect app by setting various HTTP headers

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Interest Calculator API is running");
});

export default app;
