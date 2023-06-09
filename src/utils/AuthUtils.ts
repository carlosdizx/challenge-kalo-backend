import jwt from 'jsonwebtoken';
import dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

export const generateToken = async (user: any) =>
    jwt.sign(user, JWT_SECRET, {expiresIn: JWT_EXPIRES});

const verifyToken = (token) =>
    jwt.verify(token, JWT_SECRET);

export const getUser = (token: string): any => {
    try {
        return verifyToken(token);
    }
    catch (e) {
        return null;
    }
}

export const getUserId = (token: string): string => {
    try {
        const {id} = getUser(token);
        return id;
    }
    catch (e) {
        return null;
    }
}
