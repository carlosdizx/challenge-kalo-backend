import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv = require("dotenv");
import User from "../entities/User.entity";
import Article from "../entities/Article.entity";
dotenv.config();



const host = process.env.IS_OFFLINE ? process.env.LOCAL_DB_MYSQL_HOST : process.env.PROD_DB_MYSQL_HOST;
const port = parseInt(process.env.IS_OFFLINE ? process.env.LOCAL_DB_MYSQL_PORT : process.env.PROD_DB_MYSQL_PORT);
const username = process.env.IS_OFFLINE ? process.env.LOCAL_DB_MYSQL_USER : process.env.PROD_DB_MYSQL_USER;
const password = process.env.IS_OFFLINE ? process.env.LOCAL_DB_MYSQL_PASSWORD : process.env.PROD_DB_MYSQL_PASSWORD;
const database = process.env.IS_OFFLINE ? process.env.LOCAL_DB_MYSQL_DATABASE : process.env.PROD_DB_MYSQL_DATABASE;

const dataSource =  new DataSource({
    type: "mysql",
    host,
    port,
    username,
    password,
    database,
    synchronize: true,
    entities: [
        User,
        Article
    ],
});

const getConnect = async () => {
    if(!dataSource.isInitialized) {
        console.log("Trying to connect to the database");
        await dataSource.initialize();
    }else console.log("recycled connection");
    console.log("Successfully connected!");
    return dataSource;
}

export default getConnect;
