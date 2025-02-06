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

// ✅ User Registration
app.post("/register", async (req, res) => {
    try {
        const { username, email, password, name, department, semester } = req.body;

        if (!username || !email || !password || !name || !department || !semester) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (await User.findOne({ username })) {
            return res.status(400).json({ message: "User already exists" });
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

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        res.json({ 
            message: "Login successful", 
            user: {
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
connectDB().then(() => {
    app.listen(5000, () => console.log("Server running on port 3000"));
});
