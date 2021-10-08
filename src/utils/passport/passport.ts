import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { Strategy as LocalStrategy } from "passport-local";

import passport from "passport";

import { TokenPairs } from "../jwt/jwt";

import { User } from "../../models/user";

import { getRepository } from 'typeorm';

import { validate } from 'class-validator';

import sendMail from '../../config/nodemailerConfig';

import { Request, Response } from 'express';

const { JWT_ISSUER, JWT_AUDIENCE, JWT_ACCESS_SECRET } = process.env;


//JwtStrategy for own access

const opts = {
  //jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme("JWT"), ExtractJwt.fromHeader("JWT"), ExtractJwt.fromAuthHeaderAsBearerToken()]),
  secretOrKey: JWT_ACCESS_SECRET,
  issuer: JWT_ISSUER,      
  audience: JWT_AUDIENCE,
  passReqToCallback: true,
};


passport.use(
  "auth.jwt",
  new JwtStrategy(
    opts,
    async function (_req, jwt_payload, done) {
      try {
        const { id } = jwt_payload;
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail(id);
        if (!user) {
          done("User is  not found!", null);
        }
        done(null, user);
      } catch (error) {
        console.log(error);
        done(`Something went wrong: ${error} `, null);
      }
    }
  )
);

//JwtStrategy for all users list through admin authorization
passport.use(
  "scope.all",
  new JwtStrategy(
    opts,    
    async function (_req, jwt_payload, done) {
      
      try {
        const { id } = jwt_payload;
        //let params: any = req.params
        //console.log('jwt_payload',jwt_payload)
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail(id);
        //console.log('user', user)
        //console.log('jwt_payload id', typeof id)
        //console.log('req.params.id id', typeof req.params.id)
        if (!user) {
          done("User is  not found!", null);
        } else {
          if (user.isAdmin === true) {
           const users = await userRepository.find({
            select: ["id", "firstName", "lastName", "email", "isAdmin", "confirmation", "createdAt"]
           })
            done(null, users);
          } else {
            done('Not Admin', null);
          }
        }
      } catch (error) {
        console.log(error);
        done(`Something went wrong: ${error} `, null);
      }
    }
  )
);

// Search for last name and first name 
passport.use(
  "scope.search",
  new JwtStrategy(
    opts,    
    async function (req, jwt_payload, done) {
      
      try {
        const { id } = jwt_payload;
        //let params: any = req.params
        //console.log('jwt_payload',jwt_payload)
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail(id);
        //console.log('user', user)
        //console.log('jwt_payload id', typeof id)
        //console.log('req.params.id id', typeof req.params.id)
        if (!user) {
          done("User is  not found!", null);
        } else {
          if (user.isAdmin === true) {
            const firstName = req.body.firstName
            const lastName = req.body.lastName
             const email = req.body.email
            const data = await userRepository.findAndCount({
             where: `(firstName like '%${firstName}%' or lastName like '%${lastName}%' 
       or email like '%${email}%')`
            })
            //console.log('data', data)
            done(null, data);
          } else {
            done('Not Admin', null);
          }
        }
      } catch (error) {
        console.log(error);
        
        done(`Something went wrong: ${error} `, null);
      }
    }
  )
);
//User delete option only by admin role.
passport.use(
  "scope.delete",
  new JwtStrategy(
    opts,    
    async function (req, jwt_payload, done) {
      
      try {
        const { id } = jwt_payload;
        let _id = req.params.id
        console.log('jwt_payload',jwt_payload)
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail(id);
        //console.log('user', user)
        //console.log('jwt_payload id', typeof id)
        //console.log('req.params.id id', typeof req.params.id)
        if (!user) {
          done("User is  not found!", null);
        } else {
          if (user.isAdmin === true) {
           await userRepository.findOne({ where: { id: _id } })
           userRepository.delete(_id);
            done(null, 'User Deleted');
          } else {
            done('Not Admin', null);
          }
        }
      } catch (error) {
        console.log(error);
        done(`Something went wrong: ${error} `, null);
      }
    }
  )
);

// Edit own information
passport.use(
  "scope.edit",
  new JwtStrategy(
    opts,    
    async function (req, jwt_payload, done) {
      
      try {
        const { id } = jwt_payload;
        //let params: any = req.params
        console.log('jwt_payload',jwt_payload)
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail(id);
        //console.log('user', user)
        //console.log('jwt_payload id', typeof id)
        //console.log('req.params.id id', typeof req.params.id)
        if (!user) {
          done("User is  not found!", null);
        } else {
          if (id !== req.params.id) {
            done("Id is incorrect or authorization", null);
          } else {
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
            if (password) {
              user.hashPassword();
            } 
            const errors = await validate(user);
            if (errors.length > 0) {
                done(errors, null);
                return;
            }
            
            await userRepository.save(user);
            const updatedUser = await userRepository.findOneOrFail(user.id);
            done(null, updatedUser);            
          }
        }
      } catch (error) {
        console.log(error);
        done(`Something went wrong: ${error} `, null);
      }
    }
  )
);

// Edit user information
passport.use(
  "scope.editUser",
  new JwtStrategy(
    opts,    
    async function (req, jwt_payload, done) {      
      try {
        const { id } = jwt_payload;
        //let params: any = req.params
        console.log('jwt_payload',jwt_payload)
        const userRepository = getRepository(User);
        const userAdmin = await userRepository.findOneOrFail(id);
        
        //console.log('user', user)
        //console.log('jwt_payload id', typeof id)
        //console.log('req.params.id id', typeof req.params.id)
        if (userAdmin.isAdmin !== true ) {
          done("Admin role is required!", null);
        } else {
          let userId = req.params.id
            //Get values from the body
            const { firstName, lastName, isAdmin, email, password, confirmation } = req.body;           
            
            //Try to find user on database
            const userRepository = getRepository(User);            
            const user = await userRepository.findOneOrFail({id:userId})            
              //Validate the new values on model
            user.firstName = firstName;            
            user.lastName = lastName;            
            user.isAdmin = isAdmin;
            user.confirmation = confirmation;
            user.email = email;            
            user.password = password;            
            if (password) {
              user.hashPassword();
            } 
            const errors = await validate(user);
            if (errors.length > 0) {
                done(errors, null);
                return;
            }
            
            await userRepository.save(user);
            const updatedUser = await userRepository.findOneOrFail(user.id);
            done(null, updatedUser);            
          }
        
      } catch (error) {
        console.log(error);
        done(`Something went wrong: ${error} `, null);
      }
    }
  )
);

//Log in local strategy
passport.use(
  "auth.login",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    
    async function (req: Request ,_email, res: Response, done) {
      try {
        const { email, password } = req.body;
       
        const userRepository = getRepository(User);
        let user = await userRepository.findOneOrFail({ where: { email } });
        //console.log('user', user)
        //console.log('password', password)
        //console.log('User password', user.password)  
         //Validate if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        if (user.confirmation !== false) {
          if (user.checkIfUnencryptedPasswordIsValid(password)) {
         
            const tokens = await TokenPairs({ id: user.id });

            user.date = new Date()
            
            await userRepository.save(user);
            
            console.log('tokens', tokens)
            

          done(null, { user, tokens });
        } else {
          done("User not found.", null);
        }
        } else {
          done('Please confirm your account', null)
        }

        
      } catch (error) {
        done(error, null);
      }
    }
  )
);

//Register local strategy
passport.use(
  "auth.register",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async function (req, res, _password, done) {
      try {
       
          //Get parameters from the body
        let { firstName, lastName, isAdmin, email, password } = req.body;
        
        let user = await new User();
        
        user.firstName = firstName;
        
        user.lastName = lastName;
        
        user.isAdmin = isAdmin;
        
        user.email = email;

        user.date = new Date()
        
        user.password = password
        
        user.hashPassword();   

        const userRepository = await getRepository(User);
        
        await userRepository.save(user);
        
        
         //Validate if the parameters are ok
        const errors = await validate(user);

        if (errors.length > 0) {

          res.status(400).send(errors);
          
          return;
          
        }

      try {        
        const tokens = await TokenPairs({ id: user.id });        
        const token: any = tokens.accessToken
       /*  let decode = jwt.verify(token,JWT_ACCESS_SECRET )
        console.log('decode', (<any>decode).id)
        console.log('token', token) */
        const url = `http://localhost:4000/api/users/confirmation/${token}`;
        const message = 'confirm your email'
        await sendMail(email, user.lastName, url, message)
        done(null, { user, emailLink:url });
       } catch (e) {
         console.log(e);
       }       

      } catch (error) {

        done(error, null);
        
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

export default passport;
