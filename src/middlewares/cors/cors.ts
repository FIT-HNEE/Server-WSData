import cors from 'cors';
//const { CORS_WHITE_LIST } = process.env;
const whiteList = ["http://localhost:3000", "http://localhost:3000/"];
/* const whiteList =
  typeof CORS_WHITE_LIST === 'string' ? CORS_WHITE_LIST.split(',') : []; */
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',    
  ],
  credentials: true,
  preflightContinue: false,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, origin?: string | undefined) => void
  ) => {
    if (whiteList.indexOf(origin as string) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error(`Your access has been blocked by CORS.`));
    }
  },  
};

export default () => cors(options);