import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../models/user';
import jwt from 'jsonwebtoken'
import { TokenPairs } from "../utils/jwt/jwt";
import sendMail from '../config/nodemailerConfig'

const {  JWT_ACCESS_SECRET } = process.env;

class UserController {

    static activateAcount = async (req: Request, res: Response) => {
            

        const decoded = jwt.verify(req.params.token, JWT_ACCESS_SECRET);        
            
        const id = await (<any>decoded).id        
            
        console.log('decoded_verification', id)        
            
        console.log('Token', req.params.token)
        
        if (id) {

            try {
                    
                const userRepository = getRepository(User);
            
                const user = await userRepository.findOneOrFail(id);
        
                user.confirmation = true                
            
                console.log('user', user)                
            
                const errors = await validate(user);                
            
                if (errors.length > 0) {
                
                    res.send(errors);
                    
                    return;
                    
                }
                
                await userRepository.save(user);
                            
                res.send(user);
                            
            } catch (e) {
                            
                res.send('error');
                            
            }
            
        } else {
            res.send('Id not matched')            
        }
            
        //return res.redirect('http://localhost:3001/login');
        
    }

    static changePassword = async (req: Request, res: Response) => {
            

        const decoded = jwt.verify(req.params.token, JWT_ACCESS_SECRET);        
            
        const id = await (<any>decoded).id        
            
        console.log('decoded_verification', id)        
            
        console.log('Token', req.params.token)
        
        if (id) {

            try {

                const { password } = req.body;
                    
                const userRepository = getRepository(User);
            
                const user = await userRepository.findOneOrFail(id);
        
                user.password = password;
                
                user.hashPassword();                
            
                console.log('user', user)                
            
                const errors = await validate(user);                
            
                if (errors.length > 0) {
                
                    res.send(errors);
                    
                    return;
                    
                }
                
                await userRepository.save(user);
                            
                
                    res
                        .status(200)
                        .json({ message: `Password of ${user.email} has been changed`, User: user })
                    
                            
            } catch (e) {
                            
                res.send('error');
                            
            }
            
        } else {
            res.send('Id not matched')            
        }
            
        //return res.redirect('http://localhost:3001/login');
        
    }

    static resendLink = async (req: Request, res: Response) => {
        const { email } = req.body
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail({ where: { email } });

        if (!user) {
            return res
                .status(400)
                .json({ message: `${email} is incorrect `})
        } else if (user.confirmation === true) {
            return res
                .status(400)
                .json({ message: `${email} is already verified`})

        } else {
            try {
                
                const tokens = await TokenPairs({ id: user.id });        
                const token: any = tokens.accessToken
                const url = `http://localhost:4000/api/users/confirmation/${token}`;
                const message = 'confirm your email'
                await sendMail(email, user.lastName, url, message)

                        return res
                        .status(200)
                        .json({ message: `Link to ${user.lastName} has been send`, User: user, EmailLink:url  })
            } catch (e) {                
                console.log(e);                
            }           
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail({ where: { email } });

        if (!user) {
            return res
                .status(400)
                .json({ message: `${email} is incorrect `})
        } else {
            try {
                
                const tokens = await TokenPairs({ id: user.id });        
                const token: any = tokens.accessToken
                const url = `http://localhost:4000/api/users/passwordChange/${token}`;
                const message = 'change your password'

                await sendMail(email, user.lastName, url, message)

                return res                            
                    .status(200)                    
                    .json({ message: `Link to ${user.lastName} has been send for password change`, User: user, EmailLink:url })
                
            } catch (e) {  
                console.log(e);                
            }           
        }
    }

    static login = async (req: Request, res: Response, next) => {
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
              console.log('tokens', tokens)
              res.cookie("accessToken", tokens.accessToken, {
              httpOnly: true,              
              path: "/",      
              //sameSite: "none",      
              secure: false,      
            })
            
            res.cookie("refreshToken", tokens.refreshToken, {      
              httpOnly: true,              
              path: "/",      
              //sameSite: "none",      
              secure: false,      
            });
              
              res.status(200).json({    
            status: 'OK', tokens      
            })
    

          //done(null, { user, tokens });
          } else {
              res.json('password not match')
        }
        } else {
            res.json('user not confirmed')
    }
        
            } catch (error) {
                next(error)
            }

    }    


    static logOut = async (_req: Request, res: Response, next) => {
        try {
    
            // clear cookie when logging out
            await res.clearCookie("accessToken");    
            await res.clearCookie("refreshToken");    
            //await req.logout();   
            /* response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
            response.send(200); */
        
        //res.redirect('/');
            res.status(200).json({    
            status: 'Bye!'      
            });
    
            } catch (error) {
                next(error)
            }

    }    
}

export default UserController; 