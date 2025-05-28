import express from "express";
import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
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
router.post("/", verifyAdmin, async (req, res) => {
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

// Borrow a book
router.post("/:bookId/borrow", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;
  const { returnDate } = req.body;

  try {
    // Check if the book exists and if it is available for borrowing
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    if(!book.isAvailable && book.stock <= 0){
      return res.status(400).json({ message: "Book is currently not available for borrowing." });
    }

    // Create a new borrow record
    const newBorrow = await Borrow.create({
      userId,
      bookId,
      returnDate: new Date(returnDate),
    });

    // Update the book's availability and stock
    const updateBook = await Book.findByIdAndUpdate(
      bookId,
      {$inc:{stock:1}, $set:{isAvailable:false}},
      { new: true }
    );

    return res.status(201).json({
      message: "Book borrowed successfully!",
      borrow: newBorrow,
      book: updateBook,
    });

  } catch (error) {
    console.error(`Error borrowing book with ID ${bookId}: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
