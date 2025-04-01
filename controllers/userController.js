
const user = require("../models/user");

const getAllStudents= async (req, res) => {
    try {
        const users = await user.find({},"_id name department semester");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching details" });
    }
}


module.exports={getAllStudents}