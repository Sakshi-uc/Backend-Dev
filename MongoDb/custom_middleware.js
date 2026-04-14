const express = require('express');
const app = express();

// built in middleware
app.use(express.json());

// logger middleware (global middleware)
const logger = (req, res, next) => {
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    next();
};

// apply the logger middleware to all routes
app.use(logger);

//validation middleware (route level middleware)
const validate = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ 
            msg : "Name is required" });
    }
    next();
};

//route-specific middleware
const checkAdmin = (req, res, next) => {
    // dummy check for admin role(JWT token or session can be used in real application)
    const isAdmin = true; // change to false to test non-admin access
    if (!isAdmin) {
        return res.status(403).json({ 
            msg : "Access denied - Admin only" });
    }
    next();
};

// home route
app.get('/', (req, res) => {
    res.send("Welcome to the home page");}   
);

// validation middleware applied to this route
app.post("/user", validate, (req, res) => {
    res.json({ 
        msg : "User created successfully", 
        user: req.body });
});

// route-specific middleware
app.delete("/admin", checkAdmin, (req, res) => {
    res.json({ 
        msg : "User deleted successfully" });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});