const bcrypt = require("bcrypt");
const User = require("../models/user");

// ✅ Helper Function for Regex Validation
const isValidInput = (username, email, password, name) => {
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{6,}$/;
    const nameRegex = /^[a-zA-Z ]{3,30}$/;

    return (
        usernameRegex.test(username) &&
        emailRegex.test(email) &&
        passwordRegex.test(password) &&
        nameRegex.test(name)
    );
};

// ✅ User Registration Controller
const register = async (req, res) => {
    try {
        let { username, email, password, name, department, semester } = req.body;

        if (!username || !email || !password || !name || !department || !semester) {
            return res.status(400).json({ message: "All fields are required" });
        }

        username = username.toLowerCase();
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
        res.status(500).json({ message: "Error registering user", error });
    }
};

// ✅ User Login Controller
const jwt = require('jsonwebtoken');
const Token = require('../models/token');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username.toLowerCase() }); 
        const isMatch = user ? await bcrypt.compare(password, user.password) : false;
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

        // Payload for JWT
        const payload = {
            userId: user._id,
            username: user.username,
            role: user.role
        };
        // Generate tokens
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshingToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        // Store refresh token in DB
        let refreshToken="";
        const existingUser = await Token.findOne({ userId:user._id });

        if(!existingUser){
        console.log("user not found");
        refreshToken=refreshingToken;
        await Token.create({ token: refreshToken, userId:user._id });
        }
        else{
            refreshToken=existingUser.token;
        }


        // Send refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        // Send access token and user info
        res.json({ 
            message: "Login successful", 
            accessToken,
            user: {
                userId: user._id,
                username: user.username,
                name: user.name,
                department: user.department,
                semester: user.semester,
                role: user.role,
                url: user.pictureURL
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
        console.log(error)
    }
};

// ✅ Refresh Token Endpoint
const refreshToken = async (req, res) => {
    try {
        const cookies=req.cookies;
        if(!cookies?.refreshToken) return res.sendStatus(401);
        const refreshToken = cookies.refreshToken;
        const storedToken = await Token.findOne({ token: refreshToken });
        const user= await User.findById(storedToken.userId);
        if (!storedToken) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || user._id!=decoded.userId) return res.sendStatus(403);
            const payload = { userId: user.userId, username: user.username, role: user.role };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.json({ accessToken });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// ✅ Logout Endpoint
const logout = async (req, res) => {
    try {
        const cookies=req.cookies;
        const refreshToken = cookies.refreshToken;
        if (refreshToken) {
            const del=await Token.deleteOne({ token: refreshToken });
            console.log(del);
            console.log(refreshToken);
            res.clearCookie('refreshToken');
        }
        res.sendStatus(204);//no content
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ✅ Admin Login Controller
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username.toLowerCase() }); 
        
        // Check if user exists and password matches
        const isMatch = user ? await bcrypt.compare(password, user.password) : false;
        if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });
        
        // Check if user has admin role
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        // Payload for JWT
        const payload = {
            userId: user._id,
            username: user.username,
            role: user.role
        };
        
        // Generate tokens
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshingToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        // Store refresh token in DB
        let refreshToken="";
        const existingUser = await Token.findOne({ userId:user._id });

        if(!existingUser){
        console.log("user not found");
        refreshToken=refreshingToken;
        await Token.create({ token: refreshToken, userId:user._id });
        }
        else{
            refreshToken=existingUser.token;
        }
        
        // Send refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        // Send access token and user info
        res.json({ 
            message: "Admin login successful", 
            accessToken,
            user: {
                userId: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

module.exports = { register, login, refreshToken, logout, adminLogin };

