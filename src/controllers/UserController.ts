import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../models/user';
import jwt from 'jsonwebtoken'
import { TokenPairs } from "@utils/jwt/jwt";
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: 'pakswim@gmail.com',
    pass: 'Moonstar@1987',
  },
});

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

    static resendLink = async (req: Request, res: Response) => {
        const { email } = req.body
        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail({ where: { email } });
         
        if (!user || user.confirmation === true) {
            return res
                .status(400)
                .json({ message: `${email} is incorrect or already verified`})            
        } else {
             try {        
        const tokens = await TokenPairs({ id: user.id });        
        const token: any = tokens.accessToken
         const url = `http://localhost:4000/api/users/confirmation/${token}`;

        await transport.sendMail({
          from: 'pakswim@gmail.com',
          to: email,
          subject: "Please confirm your account",
          html: `<h1>Email Confirmation</h1>
              <h2>Hello ${user.lastName}</h2>
              <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
              <a href="${url}"> ${url}</a>
              </div>`,
        })
                 return res
                .status(400)
                .json({ message: `Link to ${user.lastName} has been send`, User: user })
       } catch (e) {
         console.log(e);
       }
        }

    }


    static logOut = async (_req: Request, res: Response, next) => {
        try {
    
            // clear cookie when logging out
            await res.clearCookie("accessToken");    
            await res.clearCookie("refreshToken");    
            //await req.logout();   
        
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