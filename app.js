const express = require('express');
const app = express();
const path = require('path');
const router = require('./router');  // Ruta al archivo de rutas

// Configuración de la vista con EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear el cuerpo de las peticiones
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use('/', require('./router'));  // Esta ruta es para tus vistas generales si tienes un archivo 'router.js'
app.use('/users', router);  // Esta ruta es para tus usuarios (generación de PDF y CRUD)

// Servir el servidor en el puerto 5000
app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
  console.log('Ruta de vistas:', path.join(__dirname, 'views'));
});
