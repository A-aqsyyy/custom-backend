// import {Pool} from "pg";

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "crud_db",
//   password: "1234",
//   port: 5432
// });

// export default pool;


import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

export default pool;