const { Client } = require('pg');
const prompt = require('./prompt.js');


let dbPswrd = prompt('Enter the database password : ');

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: dbPswrd,
    database: "demopostgre"
});

module.exports = client;


