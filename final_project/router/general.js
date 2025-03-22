const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
