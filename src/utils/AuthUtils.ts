import jwt from 'jsonwebtoken';
import dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

const generateToken = async (user: any) =>
    jwt.sign(user, JWT_SECRET, {expiresIn: "1d"});

const verifyToken = (token) =>
    jwt.verify(token, JWT_SECRET);


export { generateToken, verifyToken };
