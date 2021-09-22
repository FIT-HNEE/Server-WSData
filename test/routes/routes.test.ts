const request = require('supertest');
const faker = require('faker');
import ormConfig from '../../src/config/ormConfig';
import { createConnection, getConnection, Connection } from "typeorm";

let token;
let id;


describe('Users route', () => {

  let server;
  
  const signup = '/api/users/register';
  
  const signin = '/api/users/login';

  const getUsers = '/api/users';

  const getMe = '/api/users/me';
  
  const user = {      
    email: faker.internet.email(),    
    password: faker.internet.password(),        
    firstName: faker.name.firstName(),        
    lastName: faker.name.lastName(),        
  };

  const preSave = {
    email: 'mr.sometest@gmail.com',
    password: 'abcd',    
    firstName: faker.name.firstName(),    
    lastName: faker.name.lastName(),    
    isAdmin: true
  };
  
    
  beforeAll(async () => {

    //Connection to database (drop schema should be true)
    
    const mod = await import('../../src/app');
    
    server = (mod as any).default;
    
    let connection: Connection;
    
    try {
          
      connection = await createConnection(ormConfig);
      
      if (!connection.isConnected) {
              
        await connection.connect();
        
      }
      
    } catch (e) {
      
    // no connection created yet, nothing to get      
      console.log(e)      
    }
    //Sign up 
    const result = await request(server)
          
      .post(signup)
      
      .send(preSave);
    
    expect(result.status).toBe(200);
    
        //console.log('BeforeAll-signUP', result)
    const user = result.body.user;
    
    console.log('Here User', user)
    
    id = user.id
    
    //Sign In
    const resp = await request(server)
        
      .post(signin)
      
      .send(preSave);
    
    expect(resp.status).toBe(200);
    
    token = resp.body.tokens.accessToken
    
    console.log('BeforeAll Token', token);
    
  });
  

  //Closing the connection after test run
  afterAll(async () => {      
    await getConnection().close();    
  });
  

  //Register route
    //successful registration
    
  it('should return 200 and user if email already not exist', async () => {      
    try {        
      const result = await request(server)          
        .post(signup)        
        .send(user);
      
      expect(result.status).toBe(200);      
      expect(result.body).toHaveProperty('user');      
          //console.log('signUp', result.text)
      
    } catch (error) {      
      console.log(error);      
    }    
  });
  
  //email already registered error
  it('should return 403 if email was found', async () => {          
    try {        
      await request(server)          
        .post(signup)        
        .send(preSave);
      
    } catch (error) {      
      expect(error.status).toBe(403);      
      expect(error.response.text).toEqual('{"error":"Email is already in use"}');      
    }    
  });
  
    
  // Sign In Post route
    // for error having missing credentials
  it('should return error 400 if user email and password empty', async () => {      
    let user = {};    
    try {        
      await request(server)          
        .post(signin)        
        .send(user);
      
    } catch (error) {      
      expect(error.status).toEqual(400);
      console.log('Error for empty credentials', error)
    }
    
  });
  
    // getting 200 and tokens on succesful login
  it('should return 200 and our token', async () => {      
    try {        
      const result = await request(server)          
        .post(signin)        
        .send(preSave);      

      expect(result.status).toEqual(200);   
      expect(result.body).toHaveProperty("tokens");      
        
    } catch (error) {      
      console.log(error);      
    }    
  });
  
    
//Get route for all users data 
    //200 and giving all the data of users
  it('Should return 200 and json for all enteries', async () => {
    try {
      //console.log('Here', token);
      const response = await request(server)         
        .get(getUsers)
        .set('Authorization', `Bearer ${token}`)
      
      expect(response.statusCode).toBe(200);      
      expect(response.type).toBe('application/json')
     // console.log('Users', response.body)
      
    } catch (error) {
      console.log(error)
    }
  })

// Get route for me user
  // getting error for token handling
  it('Should required Authorization', async () => {
    try {
      const response = await request(server)        
        .get(getUsers)
      
      expect(response.statusCode).toBe(401);

    } catch (error) {
      console.log(error)
    }
  })
    
  //Succesfully getting user data
  it('Should return the user data', async () => {
    try {
      //console.log('Here', token);
      const response = await request(server)         
        .get(getMe)
        .set('Authorization', `Bearer ${token}`)
      
      expect(response.statusCode).toBe(202);      
      expect(response.type).toBe('application/json')
      //console.log('Me', response.body)
      
    } catch (error) {
      console.log(error)
    }
  })

//Put/patch route
  //Succesfully updated data
  it('Should return the 200 and json data', async () => {
    try {     
      //console.log('ID', id)
      const putUser = `/api/users/${id}`;
      const response = await request(server)         
        .put(putUser)
        .set('Authorization', `Bearer ${token}`)
        .send({ lastName: 'Updated' })
      
      expect(response.statusCode).toBe(200);      
      expect(response.type).toBe('application/json')
      //console.log('Updated', response.body)
      
    } catch (error) {
      console.log(error)
    }

  })

//On updation of data getting errors for token handling
  it('Should return 401', async () => {
    try {
      const putUser = `/api/users/${id}`;
      const response = await request(server)         
        .put(putUser)
        .send({ lastName: 'Updated' })
      
      expect(response.statusCode).toBe(401);
      
    } catch (error) {
      console.log(error)
    }
  })

});

