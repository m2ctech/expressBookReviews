const Axios = require("axios");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const present = users.filter((user) => user.username === username);
    if (present.length === 0) {
      users.push({ "username": username, "password": password });
      return res.status(201).json({ message: "User created successfully" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  } else {
    return res.status(400).json({ message: "Check username and password" });
  }
});

// Get the book list available in the shop using async/await
public_users.get('/', async (req, res) => {
  const getBooks = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
  };

  try {
    const bookList = await getBooks();
    res.json(bookList);
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  const booksBasedOnIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });
  };

  booksBasedOnIsbn(ISBN)
    .then((book) => res.json(book))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get book details based on author using Promises
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksBasedOnAuthor = (auth) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = books.filter((b) => b.author === auth);
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("Books not found"));
        }
      }, 1000);
    });
  };

  booksBasedOnAuthor(author)
    .then((bookList) => res.json(bookList))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get all books based on title using Promises
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksBasedOnTitle = (bookTitle) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = books.filter((b) => b.title === bookTitle);
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("Books not found"));
        }
      }, 1000);
    });
  };

  booksBasedOnTitle(title)
    .then((bookList) => res.json(bookList))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get
