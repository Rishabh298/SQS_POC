const { Client } = require('pg');
const prompt = require('./prompt.js');


let host = prompt('Enter the host name: ');
let port = prompt('Enter the port name: ');
let user = prompt('Enter the user name: ');
let dbPswrd = prompt('Enter the database password : ');
let databaseName = prompt('Enter the database name: ');

const client = new Client({
    host: host,
    port: parseInt(port),
    user: user,
    password: dbPswrd,
    database: databaseName
});

module.exports = client;


