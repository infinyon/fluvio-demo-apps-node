import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { HTTP400Error } from "../../common/httpErrors";

export const validateUserName = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    var pattern = new RegExp(/^([a-z])([a-z0-9]*)$/);

    await check('name')
        .notEmpty()
        .withMessage('Name is mandatory.')
        .isLength({ min: 2, max: 16 })
        .withMessage('Name must be between 2 and 16 characters.')
        .custom(value => {
            if (!pattern.test(value)) {
                throw new Error('Only lowercase and numbers are accepted. Must start with a character.')
            }
            return true;
        }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HTTP400Error(errors.array({ onlyFirstError: false }));
    }

    next();
};

export const validatePassword = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    await check('password')
        .isLength({ min: 4, max: 32 })
        .withMessage('Password must be between 4-32 characters long.')
        .matches(/^([a-zA-Z0-9!@#$%^&*]+)$/, 'i')
        .withMessage('Invalid characters used.')
        .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HTTP400Error(errors.array({ onlyFirstError: false }));
    }

    next();
};