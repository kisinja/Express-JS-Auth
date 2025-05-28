import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import { books } from "./utils/index.js";
import Book from "./models/Book.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(morgan("combined"));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Default route
app.get("/api", (req, res) => {
  res.send("Welcome to the BOOK VISTA API!");
});

// Connecting to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("Connected to the database successfully!");

      // Seed the database with initial books data
      //Book.insertMany(books);

      // Listen for incoming requests
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    });
  } catch (error) {
    console.log(`Error connecting to the database: ${error.message}`);
    process.exit(1);
  }
};

// Start the server and connect to the database
connectToDatabase();

// import routes
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);