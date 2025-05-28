import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async(req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>" format
    if(!token) return res.status(401).json({message:"Access denied, no token provided!"});

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select("-password -createdAt -updatedAt -__v");

        req.user = user;

        next();
    } catch (error) {
        console.log(`Error verifying token: ${error.message}`);
        return res.status(500).json({message:"Internal server error"});
    }
};