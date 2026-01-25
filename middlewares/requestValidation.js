const { validationResult } = require('express-validator');

const { Request, Response, NextFunction } = require('express');

/**
 * Middleware to validate incoming requests using express-validator.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Response|undefined} - Returns a 400 response with validation errors if any; otherwise calls next().
 */
const requestValidation = (req, res, next ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();

}


module.exports = {
    requestValidation
};