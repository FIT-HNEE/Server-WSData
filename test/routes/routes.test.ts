const request = require('supertest');
const faker = require('faker');
import ormConfig from '../../src/config/ormConfig';
import { createConnection, getConnection, Connection } from "typeorm";

//let token;

describe('Users route', () => {
    let server;
    const signup = '/api/users/register';
    const signin = '/api/users/login';
    const user = {
        email: faker.internet.email(),        
        password: faker.internet.password(),
        firstName: faker.name.firstName(),    
        lastName: faker.name.lastName(),                
  };
  const preSave = {
    email: 'mr.sometest@gmail.com',
      password: faker.internet.password(),
    firstName: faker.name.firstName(),    
        lastName: faker.name.lastName(),
    };
    
    beforeAll(async () => { 
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
        //let token;
        const result = await request(server)
            .post(signup)            
            .send(preSave);        
        expect(result.status).toBe(200);
        //console.log('BeforeAll-signUP', result)
        const user = result.body.user;
        console.log('Here User',user)
    });

    afterAll(async () => {
        await getConnection().close();        
    });

    //describe('signup', () => {
    it('should crete new user if email not found', async () => {
      try {
        const result = await request(server)          
            .post(signup)
            .send(user);
             // .send(user);          
        expect(result.status).toBe(200);
        expect(result.body).not.toBeNull;
          expect(result.body).toHaveProperty('user');
          //console.log('signUp', result.text)
      } catch (error) {
        console.log(error);
      }
    });
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
    //});
    
    //describe('signin', () => {
    it('should return error 400 if user email and password empty', async () => {
      let user = {};
      try {
        await request(server)
          .post(signin)
          .send(user);
      } catch (error) {
        expect(error.status).toEqual(400);
      }
    });

    it('should return 200 and our token', async () => {
      try {
        const result = await request(server)
          .post(signin)
          .send(preSave);

        expect(result.status).toEqual(200);
        expect(result.body).not.toBeNull;
          expect(result.body).toHaveProperty("tokens");
         // console.log('Here', result);
      } catch (error) {
        console.log(error);
      }
    });
    //});
    

    
    /* it('should return 200', async () => {
      
        const res = await request(server)        
            .post('/api/users/register')            
            .send({          
                email: 'mail@gmail.com',                
                password: 'validpassword123',        
                firstName: 'firstName',
                lastName: 'lastName',
            });
        expect(res.status).toBe(200);        
        expect(res.type).toBe('application/json');        
        //console.log(res.text)        
    });     */
    
});




/* describe('GET /', () => {
        let token;
let app;
    beforeAll((done) => {
        const mod = import('../../src/app')
        app = (mod as any).default;
      request(app)
        .post('/api/users/login')
        .send({
          username: 'user',
          password: 'pw',
        })
        .end((_err, response) => {
          token = response.body.token; // save the token!
          done();
        });
    });

      // token not being sent - should respond with a 401
      test('It should require authorization', () => {
        return request(app)
          .get('/api/users')
          .then((response) => {
            expect(response.statusCode).toBe(401);
          });
      });
      // send the token - should respond with a 200
      test('It responds with JSON', () => {
        return request(app)
          .get('/api/users')
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json');
          });
      });
    }); */