const express = require('express');
const router = express.Router();
const conexion = require('./database/db');
// router.js





// Ruta principal para listar usuarios
router.get('/', (req, res) => {
   conexion.query('SELECT * FROM users', (error, results) => {
      if (error) {
         console.error('Error al obtener los usuarios:', error);
         res.status(500).send('Error al obtener los usuarios');
      } else {
         res.render('index', { results: results });
      }
   });
});
//usuario

router.get('/usuarioVista', (req, res) => {
   conexion.query('SELECT * FROM users', (error, results) => {
      if (error) {
         console.error('Error al obtener los usuarios:', error);
         res.status(500).send('Error al obtener los usuarios');
      } else {
         res.render('index', { results: results });
      }
   });
});

// Ruta para crear usuario
router.get('/create', (req, res) => {
   res.render('create');
});

// Ruta para eliminar usuario
router.get('/delete/:id', (req, res) => {
   const id = req.params.id;
   conexion.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
      if (error) {
         console.error('Error al eliminar el usuario:', error);
         res.status(500).send('Error al eliminar el usuario');
      } else {
         res.redirect('/');
      }
   });
});

// Ruta para editar usuario
router.get('/edit/:id', (req, res) => {
   const id = req.params.id;
   conexion.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
      if (error) {
         console.error('Error al obtener el usuario:', error);
         res.status(500).send('Error al obtener el usuario');
      } else {
         res.render('edit', { user: results[0] }); // IMPORTANTE: se llama `user`, no `users`
      }
   });
});

// Crear usuario (guardar en base de datos)
const crud = require('./controller/crud');
router.post('/save', crud.save);

// Actualizar usuario
router.post('/update', crud.update);

// Ruta para generar el PDF
router.get('/generate-pdf', crud.generatePDF);
router.get('/generate-pdf/:id', crud.generateUserPDF);


module.exports = router;
