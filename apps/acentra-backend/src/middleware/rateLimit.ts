import { rateLimit } from 'express-rate-limit';

export const publicApiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { message: "Too many requests, please try again later." }
});

export const applicationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    limit: 10, // Limit each IP to 10 applications per hour
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: "Too many applications submitted from this IP, please try again later." }
});
