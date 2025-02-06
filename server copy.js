const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const userFile = "users.json";






const loadUsers = () => {
    if (!fs.existsSync(userFile)) return [];
    return JSON.parse(fs.readFileSync(userFile, "utf8"));
};


const saveUsers = (users) => {
    fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
};


app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    let users = loadUsers();

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    else if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: "Email already in use" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, email, password: hashedPassword });
    saveUsers(users);

    res.json({ message: "Registration successful" });
});


app.post("/login", async (req, res) => {

    const { username, password } = req.body;
    let users = loadUsers();
    const user = users.find(user => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successful" });
});


app.listen(5000);
