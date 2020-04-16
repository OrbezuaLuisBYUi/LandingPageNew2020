//Requerimos el modulo pg para hacer la conexión a postgress
//Pool es un objeto del modulo pg que nos permite hacer una conaxión a la base de datos postgress
const { Pool } = require('pg');
//const session = require('express-session');
var pg = require('pg');
pg.defaults.ssl = true;
const pool = new Pool({
    host: 'ec2-3-231-46-238.compute-1.amazonaws.com',
    user: 'slcevhgtarsgbh',
    password: 'c7785847231d4fd3569cf11a9feefde8d16a1b764cada8065a8e9c7766b084db',
    database: 'denrfbg787ejjk'
});

module.exports = {
    pool
};