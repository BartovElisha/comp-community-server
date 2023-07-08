const srv = process.env.MONGO_SRV;
const user = process.env.CLOAD_MONGODB_USER;
const pass = process.env.CLOAD_MONGODB_PASSWORD;
const cluster = process.env.CLOAD_MONGODB_CLUSTER;
const database = process.env.CLOAD_MONGODB_DATABASE;
const jwt_pass = process.env.JWT_PASSWORD;

// Select Mongo DB Cload or Local DB Configuration
// Cload MongoDB Configurations
module.exports = {
    db_conn: `${srv}://${user}:${pass}@${cluster}/${database}`,
    jwt_token: jwt_pass
}
// Local MongoDB Configurations
// module.exports = {
//     db_conn: `mongodb://127.0.0.1:27017/${database}`,
//     // db_conn: `mongodb://localhost:27017/${database}`,
//     jwt_token: jwt_pass
// }