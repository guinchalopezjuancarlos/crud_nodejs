const PDFDocument = require('pdfkit');
const db = require('../database/db');
const path = require('path'); // Asegúrate de agregar esto


// Crear nuevo usuario
exports.save = (req, res) => {
  const { user, rol } = req.body;

  db.query('INSERT INTO users SET ?', { user, rol }, (error, results) => {
    if (error) {
      console.error('❌ Error al guardar usuario:', error);
    } else {
      console.log('✅ Usuario guardado correctamente');
      res.redirect('/');
    }
  });
};

// Mostrar formulario de edición
exports.edit = (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener usuario:', err);
      res.send('Error al obtener el usuario');
    } else {
      if (results.length > 0) {
        res.render('edit', { user: results[0] });
      } else {
        res.send('Usuario no encontrado');
      }
    }
  });
};

// Actualizar usuario
exports.update = (req, res) => {
  const { id, user, rol } = req.body;

  db.query(
    'UPDATE users SET user = ?, rol = ? WHERE id = ?',
    [user, rol, id],
    (err, results) => {
      if (err) {
        console.error('❌ Error al actualizar usuario:', err);
      } else {
        console.log('✅ Usuario actualizado correctamente');
        res.redirect('/');
      }
    }
  );
};
//todo imprimir
exports.generatePDF = (req, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Disposition', 'attachment; filename=usuarios.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  // 📌 Logo (ajusta la ruta según tu estructura)
  const logoPath = path.resolve(__dirname, './image/logo.png');



  doc.image(logoPath, 50, 40, { width: 100 });

  // 🏷️ Título corporativo
  doc.fontSize(22).font('Helvetica-Bold').text('Lista de Usuarios', 0, 50, { align: 'center' });
  doc.moveDown(2);

  // 🧾 Encabezado tabla
  const idX = 60;
  const userX = 150;
  const rolX = 350;

  doc.fontSize(12).font('Helvetica-Bold');
  doc.text('ID', idX, doc.y);
  doc.text('Usuario', userX, doc.y);
  doc.text('Rol', rolX, doc.y);
  doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).stroke();
  doc.moveDown();

  // 🧍‍♂️ Datos de usuarios
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('❌ Error al obtener los usuarios:', error);
      return res.status(500).send('Error al obtener los usuarios');
    }

    let y = doc.y + 5;
    doc.font('Helvetica').fontSize(12);

    results.forEach((user, index) => {
      doc.text(user.id.toString(), idX, y);
      doc.text(user.user, userX, y);
      doc.text(user.rol, rolX, y);
      y += 20;

      // Salto de página automático si se excede el espacio
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    // 🖋️ Pie de página
    doc.moveDown(2);
    doc.fontSize(10).font('Helvetica-Oblique').fillColor('gray')
      .text('Este informe ha sido generado automáticamente por el sistema.', { align: 'center' });

    doc.end();
  });
};

//individual imprimir 
// Individual imprimir
exports.generateUserPDF = (req, res) => {
    const id = req.params.id;
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
  
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err || results.length === 0) {
        console.error('❌ Error al obtener el usuario:', err);
        return res.status(404).send('Usuario no encontrado');
      }
  
      const user = results[0];
  
      // 📝 Establecer el nombre del archivo dinámicamente con el nombre del usuario
      res.setHeader('Content-Disposition', `attachment; filename=${user.user}_perfil.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);
  
      // ✅ Logo corporativo
      const logoPath = path.resolve(__dirname, './image/logo.png');
      doc.image(logoPath, 50, 40, { width: 100 });
  
      // 🏷️ Título
      doc.fontSize(22).font('Helvetica-Bold').text('Ficha del Usuario', 0, 50, { align: 'center' });
      doc.moveDown(2);
  
      // Línea divisoria decorativa
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#4F4F4F').stroke();
      doc.moveDown(2);
  
      // 📄 Datos del usuario
      doc.fontSize(14).font('Helvetica-Bold').text('ID:', 70).font('Helvetica').text(user.id.toString(), 150);
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('Usuario:', 70).font('Helvetica').text(user.user, 150);
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('Rol:', 70).font('Helvetica').text(user.rol, 150);
      doc.moveDown(2);
  
      // Firma / nota
      doc.fontSize(10).font('Helvetica-Oblique').fillColor('gray')
        .text('Este documento ha sido generado automáticamente por el sistema.', {
          align: 'center',
        });
  
      doc.end();
    });
  };
  