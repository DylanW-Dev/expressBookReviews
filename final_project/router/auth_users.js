const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = []; // User storage
const SECRET_KEY = "your_secret_key"; // Secret key for JWT signing

// Function to check if username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Function to authenticate user
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: "User not logged in." });
    }

    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(403).json({ message: "Invalid token format." });
    }

    jwt.verify(tokenParts[1], SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }
        req.username = decoded.username; // Store username in request
        next();
    });
};

// Login Route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful!", token });
});

let bookReviews = {}; // Store book reviews

// Add or update a book review (Requires authentication)
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body; // Use request body instead of query params
    const username = req.username; // Extracted from JWT

    if (!review) {
        return res.status(400).json({ message: "Review cannot be empty." });
    }

    if (!bookReviews[isbn]) {
        bookReviews[isbn] = {}; // Initialize if no reviews exist
    }

    bookReviews[isbn][username] = review; // Add or update review

    return res.status(200).json({ message: "Review added/updated successfully.", bookReviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;