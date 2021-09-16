const request = require('supertest')
import ormConfig from '../../src/config/ormConfig';
import { createConnection, getConnection, Connection } from "typeorm";

describe('/api/users/auth', () => {
    let server;    
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
    });

    afterAll(async () => {
        await getConnection().close();        
    });
    
    it('should return 200', async () => {
      
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
    });    
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