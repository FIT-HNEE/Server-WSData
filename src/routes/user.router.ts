import express from 'express';

import passport from "../utils/passport/passport";

import tokenHandler from "../middlewares/TokenHandler/TokenHandler";

//import UserController from '../controllers/UserController'

//import { User } from "../models/user";

//import { getRepository } from 'typeorm';

//import { validate } from 'class-validator';

//import ApiError from '../middlewares/ErrorHandling/ApiError';

const router = express.Router();

router.post("/register", passport.authenticate("auth.register"), tokenHandler);

router.post("/login", passport.authenticate("auth.login"), tokenHandler);

router.get("/me", passport.authenticate("auth.jwt"), tokenHandler);

router.get("/:id", passport.authenticate("scope.me"), tokenHandler);

router.get("/", passport.authenticate("scope.all"), tokenHandler)

router.put("/:id", passport.authenticate("scope.edit"), tokenHandler)

router.delete("/:id", passport.authenticate("scope.delete"), tokenHandler)
/* router.put(
  "/:id",
  passport.authenticate("scope.me"),
    async (req, res, next) => {
      
      try {
        //Get the ID from url
        const id = req.params.id;

        //Get values from the body
        const { firstName, lastName, isAdmin, email, password } = req.body;
         
        //Try to find user on database
          const userRepository = getRepository(User);
          const user = await userRepository.findOneOrFail(id)
          //Validate the new values on model
        user.firstName = firstName;
        user.lastName = lastName;
        user.isAdmin = isAdmin;
          user.email = email;
          user.password = password;
          user.hashPassword();

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
    } catch (e) {
      next(e);
    }
  }
); */

/* router.delete(
  "/:id",
  passport.authenticate("scope.me"),
  async (req, res) => {
    //Get the ID from the url
        const id = req.params.id;

        const userRepository = getRepository(User);
        //let user: User;
        try {
             await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        userRepository.delete(id);

        
        res.status(204).send('User deleted');
  }
);
 */
/* router.delete(
  "/:id/:userId",
  passport.authenticate("scope.me"),
  async (req, res) => {
    //Get the ID from the url
    const id = req.params.id;
    const _id = req.params.userId;

    const userRepository = getRepository(User);
    const user = await userRepository.findOneOrFail(id);
        //let user: User;
        if (user.isAdmin === true) {
          await userRepository.findOne({ where: { id: _id } })
           userRepository.delete(_id);       
          res.status(200).send('User with firstName Deleted');          
          } else {
             res.status(400).send('Something went wrong');
          }
       
  }
); */

export default router;