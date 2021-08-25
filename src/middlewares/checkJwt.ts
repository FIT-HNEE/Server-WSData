import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/secret';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    const token = <string>req.headers["auth"];
    let jwtPayload;
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    try {
        res.locals,jwtPayload
    } catch (error) {
        res.status(401).send(error);
        return;
    }

    //The token is valid for 1 hour
  //We want to send a new token on every request
    const { userId, email } = jwtPayload;
    const newToken = jwt.sign({ userId, email }, config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken)

    //call the next middleware or controller
    next();
}