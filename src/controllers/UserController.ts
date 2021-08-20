import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../models/user';

class UserController {
    
    static listAll = async (req: Request, res: Response) => {
        // Get users from Database
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "firstName", "lastName", "email", "role"]
        });

        //Send the users object
        res.send(users)
    }

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: any = req.params.id;

        //Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: [ "id", "firstName", "lastName", "role", "email"] //We dont want to send the password on response
            })
            res.send(user)
        } catch (error) {
             res.status(404).send(error);
        }
        
    }

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { firstName, lastName, role, email, password } = req.body;
        let user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.role = role;
        user.email = email;
        user.password = password

        //Validate if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Hash the password to securely store on DB
        //user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(User);
        //console.log(userRepository)
        try {
            await userRepository.save(user);
        } catch (error) {
            res.status(409).send(error);
            return;
        }

        //If all ok, send 201 response
        res.status(201).send("User Created")
    }

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from url
        const id = req.params.id;

        //Get values from the body
        const { firstName, lastName, role, email } = req.body;

        //Try to find user on database
        const userRepository = getRepository(User);
        let user;

        try {
            user = await userRepository.findOneOrFail(id)
        } catch (error) {
            //if not found, send a 404 response
            res.status(404).send("User not found");
            return;
        }

        //Validate the new values on model
        user.firstName = firstName;
        user.lastName = lastName;
        user.role = role;
        user.email = email;

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (error) {
            res.status(409).send("username already in use");
            return;
        }
        //After all send a 201 with updated user content
        res.status(201).send(user)
    };

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        userRepository.delete(id);

        //After all send a 204 (no content, but accepted) reponse
        res.status(204).send();
    }
}

export default UserController;