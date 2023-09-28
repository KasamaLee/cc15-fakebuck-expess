const { rateLimit } = require('express-rate-limit')

module.exports = rateLimit({
    windowMs: 15 * 6 * 1000,
    limit: 100,
    message: { msg: 'Too many requests from this IP' }
})