import { DataSource } from "typeorm";
import dotenv = require("dotenv");
import User from "../entities/User.entity";
import Article from "../entities/Article.entity";
dotenv.config();

const dataSource =  new DataSource({
    type: "mysql",
    host: process.env.DB_MYSQL_HOST,
    port: parseInt(`${process.env.DB_MYSQL_PORT}`),
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DATABASE,
    synchronize: true,
    entities: [
        User,
        Article
    ],
})

const getConnect = async () => {
    if(!dataSource.isInitialized) {
        console.log("Trying to connect to the database");
        await dataSource.initialize();
    }else console.log("recycled connection");
    console.log("Successfully connected!");
    return dataSource;
}

export default getConnect;
