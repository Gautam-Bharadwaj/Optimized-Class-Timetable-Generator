module.exports = (req, res, next) => {
    // Skip API key check in development mode
    if (process.env.NODE_ENV === 'development') {
        return next();
    }

    const apiKey = req.headers['apiauthkey'];
    const validKey = '6c25bacdc2ecdb72327ce01d755942a29cb3b39188261e4d4e289a372d1b987d';
    if (!apiKey || (apiKey !== process.env.API_AUTH_KEY && apiKey !== validKey)) {
        return res.status(403).json({ error: 'Invalid or missing API Key' });
    }
    next();
};
