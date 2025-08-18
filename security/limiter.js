import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: 'Too many view requests from this IP, please try again after a minute.',
});