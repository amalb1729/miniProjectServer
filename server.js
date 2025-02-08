const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./connect");
const User = require("./models/user");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// ✅ Helper Function for Regex Validation
const isValidInput = (username, email, password, name) => {
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/; // 4-20 characters, only letters, numbers, and underscores
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,}$/; // At least one letter, one number, 6+ chars
    const nameRegex = /^[a-zA-Z ]{3,30}$/; // Only letters & spaces, 3-30 characters

    return (
        usernameRegex.test(username) &&
        emailRegex.test(email) &&
        passwordRegex.test(password) &&
        nameRegex.test(name)
    );
};

// ✅ User Registration
app.post("/register", async (req, res) => {
    try {
        let { username, email, password, name, department, semester } = req.body;

        if (!username || !email || !password || !name || !department || !semester) {
            return res.status(400).json({ message: "All fields are required" });
        }

        username = username.toLowerCase(); // Ensure case-insensitive uniqueness
        email = email.toLowerCase();

        if (!isValidInput(username, email, password, name)) {
            return res.status(400).json({ message: "Invalid username, email, password, or name format" });
        }

        if (await User.findOne({ username })) {
            return res.status(400).json({ message: "Username already exists" });
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, name, department, semester });
        await newUser.save();

        res.json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
});

// ✅ User Login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() }); // Case-insensitive username check
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        res.json({ 
            message: "Login successful", 
            user: {
                username: user.username,
                name: user.name,
                department: user.department,
                semester: user.semester
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// ✅ Start Server After Connecting to MongoDB
app.listen(5000, () => console.log("Server running on port 5000"));
