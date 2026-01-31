const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* ================= USER REGISTRATION ================= */
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
public_users.get('/', (req, res) => res.status(200).json(books));

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return books[isbn]
    ? res.status(200).json(books[isbn])
    : res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const filtered = Object.values(books).filter(b => b.author.toLowerCase() === author);
  return filtered.length
    ? res.status(200).json(filtered)
    : res.status(404).json({ message: "No books found by this author" });
});

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const filtered = Object.values(books).filter(b => b.title.toLowerCase() === title);
  return filtered.length
    ? res.status(200).json(filtered)
    : res.status(404).json({ message: "No books found with this title" });
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return books[isbn]
    ? res.status(200).json(books[isbn].reviews)
    : res.status(404).json({ message: "Book not found" });
});

/* ================= ASYNC AXIOS ROUTES ================= */

// Task 10 — Get All Books (Async)
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11 — Get Book by ISBN (Async)
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    const isbn = req.params.isbn;

    return allBooks[isbn]
      ? res.status(200).json(allBooks[isbn])
      : res.status(404).json({ message: "Book not found" });
  } catch {
    res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});

// Task 12 — Get Books by Author (Async)
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const author = req.params.author.toLowerCase();
    const filtered = Object.values(response.data).filter(
      b => b.author.toLowerCase() === author
    );

    return filtered.length
      ? res.status(200).json(filtered)
      : res.status(404).json({ message: "No books found by this author" });
  } catch {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13 — Get Books by Title (Async)
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const title = req.params.title.toLowerCase();
    const filtered = Object.values(response.data).filter(
      b => b.title.toLowerCase() === title
    );

    return filtered.length
      ? res.status(200).json(filtered)
      : res.status(404).json({ message: "No books found with this title" });
  } catch {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

module.exports.general = public_users;

