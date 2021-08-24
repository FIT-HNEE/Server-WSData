import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../models/user';
import config from '../config/secret';

class AuthController {
    static login = async (req: Request, res: Response) => {
        //Check if username and password are set
        let { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send()
        }
        //Get user from database
        const userRepository = getRepository(User);
        let user: User;
        user = await userRepository.findOneOrFail({ where: { email } });
        try {
            //Check if encrypted password match
            if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                res.status(401).send();
                return;
            }
        } catch (error) {
            res.status(401).send();
        }
        
        //JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            config.jwtSecret,
            { expiresIn: "1h" }
        );
        //Send the jwt in the response
        res.send(token);
    };

    static changePassword = async (req: Request, res: Response) => {

    //Get ID from JWT
        const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send()
        }

        //Get user from database
        const userRepository = getRepository(User);
        let user: User
        user = await userRepository.findOneOrFail(id);

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        res.status(401).send();
        return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
        res.status(400).send(errors);
        return;
        }
        //Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        res.status(204).send();
    }

}


