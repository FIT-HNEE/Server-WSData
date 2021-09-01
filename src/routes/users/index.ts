import express from 'express';

import passport from "../../utils/passport/passport";

import tokenHandler from "../../middlewares/TokenHandler/TokenHandler";

//import ApiError from '../middlewares/ErrorHandling/ApiError';

const router = express.Router();

router.post("/register", passport.authenticate("auth.register"), tokenHandler);

router.post("/login", passport.authenticate("auth.login"), tokenHandler);

router.get("/me", passport.authenticate("auth.jwt"), tokenHandler);

router.get("/", passport.authenticate("scope.all"), tokenHandler)

router.put("/:id", passport.authenticate("scope.edit"), tokenHandler)

router.delete("/:id", passport.authenticate("scope.delete"), tokenHandler)

router.get('/logout', async function (req, res, next) {
  try {
    
    // clear cookie when logging out
    await res.clearCookie("accessToken");    
    await res.clearCookie("refreshToken");    
    await req.logout();   
  
 //res.redirect('/');
    res.status(200).json({    
      status: 'Bye!'      
    });
    
  } catch (error) {
    next(error)
  }
 
});
export default router;