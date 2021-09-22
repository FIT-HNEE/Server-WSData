import { createConnection } from 'typeorm';
import dbConfig from './config/ormConfig';
const PORT = process.env.PORT;
import app from './app'
import chalk from 'chalk';

createConnection(dbConfig)
  .then((_connection) => {
    app.listen(PORT, () => {    
      console.log( chalk.blue(`🚀 Server is up and running on port ${PORT} 👍`)        
      );
    });    
})
  .catch((err) => {
    console.log( chalk.red(`❌ Server is not running due to error: ${err.message} `)),   
    process.exit(1)
  })
