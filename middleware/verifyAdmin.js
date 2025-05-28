import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    // Getting the token from the request headers
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>" format
    if(!token) return res.status(401).json({message:"Access denied, no token provided!"});

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user has admin role
        if(!payload || payload.role !== 'admin'){
            return res.status(403).json({message:"Access denied, admin role required!"});
        } else{
            // Attach the user payload to the request object for further use in the route handlers
            req.user = payload;
            next();
        }
    } catch (error) {
        console.log("Error verifying admin!!", error.message);
        return res.status(500).json({message:"Internal server error"});
    }
};