import { createConnection } from 'typeorm';
import dbConfig from './config/ormConfig';
const PORT = process.env.PORT || 4000;
import app from './app'

createConnection(dbConfig)
  .then((_connection) => {
    app.listen(PORT, () => {    
      console.log("Server is running on port. 👍", PORT);      
    });    
})
  .catch((err) => {
    console.log("Not Connected to DB 👎 :", err);
    process.exit(1)
  })
