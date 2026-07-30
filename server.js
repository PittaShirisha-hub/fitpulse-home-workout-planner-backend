import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./config/supabase.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { logger } from "./middleware/logger.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "FitPulse Backend Running 🚀",
  });
});

// Test Supabase Connection
app.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*");

    if (error) {
      console.error(error);
      return res.status(400).json(error);
    }

    return res.json(data);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});