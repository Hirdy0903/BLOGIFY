const { Router } = require('express');
const { User } = require('../models/USER');
const router = Router();
router.get("/signin", (req, res) => {
    res.render("signin");
});
router.get("/signup", (req, res) => {
    res.render("signup");
});
router.post("/signup", async (req, res) => {
    console.log("Signup route hit, body:", req.body);
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;

    console.log("Form data - fullName:", fullName, "email:", email, "password:", password);

    if (!fullName || !email || !password) {
        return res.status(400).send("Full name, email, and password are required.");
    }

    try {
        console.log("Attempting to create user...");
        await User.create({
            FullName: fullName,
            Email: email,
            Password: password
        });
        console.log("User created successfully");
        return res.redirect("/");
    } catch (error) {
        console.error("Error creating user:", error.message);
        console.error("Full error:", error);
        return res.status(500).send("Error: " + error.message);
    }
});


module.exports = { router };
