import express from "express";
import Book from "../models/Book.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

// Apply middleware to verify token
//router.use(verifyToken);

// Get all books
router.get("/", async (req, res) => {
    console.log(req.user);
  try {
    const books = await Book.find();
    const bookCount = await Book.countDocuments();

    return res.status(200).json({ books, bookCount });
  } catch (err) {
    console.error(`Error fetching books: ${err.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// Get a single book by ID
router.get("/:bookId", verifyToken, async (req, res) => {
  const { bookId } = req.params;
  console.log(req.user);
  try {
    const book = await Book.findById(bookId);
    if (!book)
      return res.status(404).json({ message: "Book requested not found!" });

    return res.status(200).json(book);
  } catch (error) {
    console.error(`Error fetching book with ID ${bookId}: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Adding a new Book
router.post("/", verifyAdmin, async(req, res) => {
  try {
    const newBook = await Book.create(req.body);
    return res.status(201).json({
      message: "New book added successfully!",
      book: newBook,
    });
  } catch (error) {
    console.log("Error adding new book: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
