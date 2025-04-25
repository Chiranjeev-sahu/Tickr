const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const authMiddleware = async (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required: Missing or invalid token' });
        }
        const token = authHeader.split(' ')[1]; 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Authentication required: Invalid token' }); 
        }

        req.user = {
            userId: user._id,
            role: user.role,
        };
        next();
    } catch (error) 
    {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Authentication required: Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Authentication required: Invalid token' });
        }
        
        console.error("Authentication Middleware Error:", error);
        return res.status(500).json({ message: 'Internal server error during authentication' });
    }
};

module.exports = authMiddleware;
