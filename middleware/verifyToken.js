import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async(req, res, next) => {
    // Getting the token from the request headers
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>" format
    if(!token) return res.status(401).json({message:"Access denied, no token provided!"});

    try {
        // Verify the token using the secret key
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Check if the user exists in the database
        const user = await User.findById(payload.id).select("-password -createdAt -updatedAt -__v");

        if(!user) return res.status(404).json({message:"User not found!"});

        // Attach the user to the request object for further use in the route handlers
        req.user = user;

        next();
    } catch (error) {
        console.log(`Error verifying token: ${error.message}`);
        return res.status(500).json({message:"Internal server error"});
    }
};