// middleware/authMiddleware.js (recommended location)
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  console.log(req.headers)
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    console.log('No auth header');
    return res.status(401).json({"message":"No Authorization header"});
  }
  
  // Make sure we can split the header properly
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('Malformed auth header:', authHeader);
    return res.status(401).json({"message":"Malformed Authorization header"});
  }
  
  const token = parts[1];
  if (!token) {
    console.log('No token in auth header');
    return res.status(401).json({"message":"No token provided"});
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification error:', err.message);
      return res.status(401).json({"message":"Invalid token"});
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;