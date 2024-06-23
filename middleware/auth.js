const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from cookie
    const token = req.cookies.token;

    // Check if no token
    if (!token) {
        res.redirect('../public/landPage.html')
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.redirect('../public/landPage.html')
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
