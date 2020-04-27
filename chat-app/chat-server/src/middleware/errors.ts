import { Response, NextFunction } from "express";
import { HTTPClientError, HTTP404Error } from "../common/httpErrors";

export const notFoundError = (path: string) => {
    throw new HTTP404Error(`Request "${path}" not found.`);
};

export const clientError = (err: Error, res: Response, next: NextFunction) => {
    if (err instanceof HTTPClientError) {
        console.warn(`Error: ${err.message}`);
        res.status(err.statusCode).send({ error: err.message });
    } else {
        next(err);
    }
};

export const serverError = (err: Error, res: Response, next: NextFunction) => {
    console.error(err);
    if (process.env.NODE_ENV === "production") {
        res.status(500).send("Internal Server Error");
    } else {
        res.status(500).send(err.stack);
    }
};