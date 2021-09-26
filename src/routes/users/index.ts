import express from 'express';

import passport from "../../utils/passport/passport";

import tokenHandler from "../../middlewares/TokenHandler/TokenHandler";

import UserController from '../../controllers/UserController'

const router = express.Router();

//Routes

router.post("/register", passport.authenticate("auth.register"), tokenHandler);

router.get('/confirmation/:token', UserController.activateAcount)

router.post('/email/resend', UserController.resendLink)

router.post("/login", passport.authenticate("auth.login"), tokenHandler);

router.get("/me", passport.authenticate("auth.jwt"), tokenHandler);

router.get("/", passport.authenticate("scope.all"), tokenHandler)

router.get('/forgotPassword', UserController.forgotPassword)

router.put("/:id", passport.authenticate("scope.editUser"), tokenHandler)

router.put("/me/:id", passport.authenticate("scope.edit"), tokenHandler)

router.put('/passwordChange/:token', UserController.changePassword)

router.delete("/:id", passport.authenticate("scope.delete"), tokenHandler)

router.get('/logout', UserController.logOut );

 
export default router;