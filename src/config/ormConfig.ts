import { ConnectionOptions } from "typeorm";
import { User } from '../models/user'
const config: ConnectionOptions = {
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "climatic-data-project",
    entities: [User],
    synchronize: true,
    dropSchema: false,
    //migrationsRun: true,
    cli: {
        migrationsDir: 'src/migration',
    }
};

export default config;