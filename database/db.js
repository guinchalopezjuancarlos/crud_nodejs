
// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'tienda_back',
  port: 3307,
});

connection.connect((error) => {
  if (error) {
    console.error('❌ Error de conexión a la base de datos:', error.message);
    return;
  }
  console.log('✅ ¡Conectado a la base de datos MySQL!');
});

module.exports = connection;



