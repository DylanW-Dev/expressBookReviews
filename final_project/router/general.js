const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted book list
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  if (books[ISBN]) {
      res.send(books[ISBN]); // Send book details
  } else {
      res.status(404).send({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author; // Extract author from URL
  let matchingBooks = [];

  // Iterate through books object
  for (let bookId in books) {
      if (books[bookId].author === authorName) {
          matchingBooks.push(books[bookId]);
      }
  }

  if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
  } else {
      return res.status(404).json({ message: "No books found for this author" });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const bookTitle = req.params.title; // Extract author from URL
  let matchingBooks = [];

  // Iterate through books object
  for (let bookId in books) {
      if (books[bookId].title === bookTitle) {
          matchingBooks.push(books[bookId]);
      }
  }

  if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
  } else {
      return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  
  if (books[ISBN]) {
      res.send(books[ISBN].reviews); // Send book details
  } else {
      res.status(404).send({ message: "Book not found" });
  }
});

// Function to simulate fetching books asynchronously
const fetchBooks = async () => {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          if (books) {
              resolve(books); // Resolve with books data
          } else {
              reject(new Error("Books data not available"));
          }
      }, 1000); // Simulate network delay
  });
};

// Route to get books using Async-Await
public_users.get('/books', async (req, res) => {
  try {
      const bookList = await fetchBooks(); // Fetch books using async function
      res.status(200).json(bookList);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Function to fetch book details based on ISBN asynchronously
const fetchBookByISBN = async (isbn) => {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          if (books[isbn]) {
              resolve(books[isbn]); // Return book details
          } else {
              reject(new Error("Book not found"));
          }
      }, 1000); // Simulating a delay
  });
};

// Get book details based on ISBN (Refactored with Async-Await)
public_users.get('/isbn/:isbn', async function (req, res) {
  const ISBN = req.params.isbn;
  
  try {
      const bookDetails = await fetchBookByISBN(ISBN); // Wait for book data
      res.status(200).json(bookDetails);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});

module.exports.general = public_users;
