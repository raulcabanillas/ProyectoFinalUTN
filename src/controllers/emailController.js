const controller = {};

var nodemailer = require('nodemailer');

let emailSender = 'app.musica.contact@gmail.com';
let passSender = 'App123456';



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailSender,
    pass: passSender
  }
});

controller.contacto = (req, res) => {
  const { nombre, email } = req.body;

  let mensaje = "Bienvenido a nuestro sitio !"
    + " Haznos tu consulta y te contactaremos a la brevedad.";

  let mensajeSubject = "Hola " + nombre + " ! ";

  var mailOptions = {
    from: emailSender,
    to: email,
    subject: mensajeSubject,
    text: mensaje
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
      res.render('contacto', {
        titulo: 'Se ha enviado correo correctamente.',
    });

    }
  });
  
};


module.exports = controller;