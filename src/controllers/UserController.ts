import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../models/user';
import jwt from 'jsonwebtoken'

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