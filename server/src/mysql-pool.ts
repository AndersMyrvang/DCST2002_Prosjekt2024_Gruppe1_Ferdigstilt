import mysql from 'mysql2';
import sqlite3 from 'sqlite3';
const mkdirp = require('mkdirp');

mkdirp.sync('./var/db');

const sqliteDB = new sqlite3.Database('./var/db/sessions.db');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 1,
  typeCast: (field, next) =>
    field.type == 'TINY' && field.length == 1 ? field.string() == '1' : next(),
});

export { pool, sqliteDB };
