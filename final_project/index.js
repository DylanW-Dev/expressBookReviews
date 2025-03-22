const express = require('express');
const jwt = require('jsonwebtoken');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

// Token verification middleware (corrected to use headers)
app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers["authorization"]; // Expecting "Bearer <token>"
    
    if (!authHeader) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(403).json({ message: "Invalid token format." });
    }

    jwt.verify(tokenParts[1], "your_secret_key", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }
        req.username = user.username;
        next();
    });
});

const { users } = require('./router/auth_users.js'); // Use the same users array

// User Registration Route
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists!" });
    }

    users.push({ username, password });

    return res.status(201).json({ message: "User successfully registered. Now you can log in." });
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));