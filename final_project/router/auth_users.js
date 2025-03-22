const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // User storage

const SECRET_KEY = "your_secret_key"; // Secret for signing JWT tokens

// Function to check if username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Function to authenticate user
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login Route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Validate user credentials
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful!", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
