const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "qwerQWER@1234",
    database: "demopostgre"
});

module.exports = client;


