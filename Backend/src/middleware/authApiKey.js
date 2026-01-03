module.exports = (req, res, next) => {
    // Skip API key check in development mode
    if (process.env.NODE_ENV === 'development') {
        return next();
    }

    const apiKey = req.headers['apiauthkey'];
    if (!apiKey || apiKey !== process.env.API_AUTH_KEY) {
        return res.status(403).json({ error: 'Invalid or missing API Key' });
    }
    next();
};
