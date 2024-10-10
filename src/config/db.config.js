import pg from "pg";
import dotenv from "dotenv";
dotenv.config({path:'./db.env'});


const { Client } = pg;

const client = new Client({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASS,
    port: process.env.DATABASE_PORT,
});


// Connecting to db
export const connectDB = async()=>{
    try {
        
        await client.connect();
        console.log("Connected to PostgreSQL successfully");
    } catch (error) {
        console.error("Failed to connectDB",error);
    }
}
export default client;





