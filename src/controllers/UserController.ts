import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../models/user';
import jwt from 'jsonwebtoken'
import { TokenPairs } from "../utils/jwt/jwt";
import sendMail from '../config/nodemailerConfig'
import moment from 'moment'
const {  JWT_ACCESS_SECRET, LOCALHOST_HOSTNAME } = process.env;

class UserController {

    static sendReminder = async () => {

    //console.log(`now: ${new Date()}`);
    ///The Main Function 
    const userRepository = await getRepository(User);
     const users = await userRepository.find({
            select: ["id", "firstName", "lastName", "email", "isAdmin", "confirmation", "createdAt", "date"]
     })
        //console.log('Users', users)
    // looping through the users
    await users.forEach(user => {
      //console.log('user', user)
        const lastLoginDate = user.date;
        console.log('lastLoginDate', lastLoginDate)  
        const reminderDate = moment(lastLoginDate).add(4, 'M');
        //const reminderDate = moment(lastLoginDate).add(1, 'd');   # For test only
        const reminderDateUtcFormat = moment(reminderDate).utc()
        const reminderDateToDate = reminderDateUtcFormat.toDate()
        const reminderDateMilliseconds: number = reminderDateToDate.getTime()
        console.log(typeof reminderDateMilliseconds) //return number
        console.log('reminderDate millisecondTime ', reminderDateMilliseconds) //return number 
        console.log('Reminder future converted date', new Date(reminderDateMilliseconds))

        const currentDate = new Date()
        console.log("current Date", currentDate)
        const currentDateMilliseconds: number = currentDate.getTime()
        console.log(typeof currentDateMilliseconds) //return number
        console.log('CurrentDate millisecondTime', currentDateMilliseconds) //return number
        console.log('Reminder current converted date', new Date(currentDateMilliseconds))

        console.log( currentDateMilliseconds >=  reminderDateMilliseconds); 
        
         //console.log( 'true/false', reminderDate === currentDate ) //return number
        // Sending the Mail
          if(currentDateMilliseconds >=  reminderDateMilliseconds ){
            //const url = `http://localhost:4000/api/users/confirmation/${token}`;
        if (user.isAdmin === false) {
            const message = 'Hello Please reacitivate your account. If you are no more interseted to reactivate this account, please ignore this email'
            const url = `${LOCALHOST_HOSTNAME}/api/users/reConfirmation/${user.id}`            
         
            return sendMail(user.email, user.lastName, url, message)
       } 
        } 
        
    });
    };


    static deleteDeactivatedAccount = async () => {

    //console.log(`now: ${new Date()}`);
    ///The Main Function 
    const userRepository = await getRepository(User);
     const users = await userRepository.find({
            select: ["id", "firstName", "lastName", "email", "isAdmin", "confirmation", "createdAt", "date"]
     })
        //console.log('Users', users)
    // looping through the users
        await users.forEach(user => {
        if (user.isAdmin === false) {
            console.log('user', user)            
        const lastLoginDate = user.date;
        console.log('lastLoginDate', lastLoginDate)  
        const accountDeletionDate = moment(lastLoginDate).add(5, 'M');
        //const accountDeletionDate = moment(lastLoginDate).add(2, 'd');
        const accountDeletionDateUtcFormat = moment(accountDeletionDate).utc()
        const accountDeletionDateToDate = accountDeletionDateUtcFormat.toDate()
        const accountDeletionDateMilliseconds: number = accountDeletionDateToDate.getTime()
        console.log(typeof accountDeletionDateMilliseconds) //return number
        console.log('Delete accountDeletionDate millisecondTime ', accountDeletionDateMilliseconds) //return number 
        console.log('accountDeletionDate converted date', new Date(accountDeletionDateMilliseconds))

        const currentDate = new Date()
        console.log("Delete current Date", currentDate)
        const currentDateMilliseconds: number = currentDate.getTime()
        console.log(typeof currentDateMilliseconds) //return number
        console.log('Delete CurrentDate millisecondTime', currentDateMilliseconds) //return number
        console.log('accountDeletionDate current converted date', new Date(currentDateMilliseconds))

        console.log( currentDateMilliseconds >=  accountDeletionDateMilliseconds); 
        
         //console.log( 'true/false', accountDeletionDate === currentDate ) //return number
        // Sending the Mail
          if(currentDateMilliseconds >=  accountDeletionDateMilliseconds ){
            return  userRepository.delete(user.id);             
       } 
        } 
        
    });
    };
    
    static reActivateAcount = async (req: Request, res: Response) => {
            
        const id = await req.params.id
        
        if (id) {

            try {
                    
                const userRepository = getRepository(User);
            
                const user = await userRepository.findOneOrFail(id);
        
                user.date = await new Date()                
            
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
                const url = `${LOCALHOST_HOSTNAME}/api/users/confirmation/${token}`;
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
                const url = `${LOCALHOST_HOSTNAME}/api/users/passwordChange/${token}`;
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
        
}

export default UserController; 