const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* ================= USER REGISTRATION ================= */

// Task 6 — Register New User
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

/* ================= BASIC BOOK ROUTES ================= */

// Task 1 — Get All Books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Task 2 — Get Book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Task 3 — Get Books by Author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const filteredBooks = Object.values(books).filter(book =>
    book.author.toLowerCase() === author
  );

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found by this author" });
});

// Task 4 — Get Books by Title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const filteredBooks = Object.values(books).filter(book =>
    book.title.toLowerCase() === title
  );

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found with this title" });
});

// Task 5 — Get Reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});


/* ================= ASYNC AXIOS ROUTES ================= */

// Task 10 — Get All Books (Async/Await)
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11 — Get Book by ISBN (Async/Await)
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 12 — Get Books by Author (Async/Await)
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 13 — Get Books by Title (Async/Await)
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

module.exports.general = public_users;
