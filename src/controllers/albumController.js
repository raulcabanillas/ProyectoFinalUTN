const controller = {};

const { Console } = require('console');
const mysql = require('mysql2');
const { isAbsolute } = require('path');

//Creamos la configuración de la conexión
const conexion = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "dbmusica1",
    dateStrings: 'date'
});

//Conectamos a la DB
conexion.connect((error) => {
    if (error)
        console.log(error);
    else
        console.log('Conexión a la Data Base exitosa!!');
});


controller.list = (req, res) => {
    let sql = 'SELECT a.idalbum, a.titulo, a.rating, a.premios, a.lanzamiento, g.nombregenero, i.nombre FROM dbmusica1.album a join dbmusica1.interprete i on a.interpreteid = i.idinterprete join dbmusica1.genero g on a.generoid = g.idgenero order by a.idalbum';
    conexion.query(sql, (error, results) => {
        console.log(results);


        if (error) throw error;
        res.render('album', {
            titulo: 'Album',
            results: results,
        })
    })
};

controller.delete = (req, res) => {
    conexion.query('DELETE FROM album WHERE idalbum = ' + [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.redirect('/album');
        }
        else {
            console.log(err);
        }

    })
};

controller.create = (req, res) => {
    //Desestructuración de las variables
    console.log(req.body);
    const { titulo, rating, premios, lanzamiento, interprete, genero } = req.body;
    if (titulo == "" || rating == "" || premios == "" || lanzamiento == "" || interprete == "" || genero == "") {
        let validacion = 'Faltan datos para guardar el Album';
        res.render('formulario', {
            titulo: 'Formulario para Completar',
            validacion
        });
    } else {
        //Insertar datos a la DB
        let data = {
            titulo: titulo,
            rating: rating,
            premios: premios,
            lanzamiento: lanzamiento,
            interpreteid: interprete,
            generoid: genero
        }
        let sql = 'Insert into album set ?';
        conexion.query(sql, data, (error, results) => {
            if (error) {
                throw error;
            }
            else {
                res.redirect('/album');
            }
        })
    }
};

controller.update = (req, res) => {
    console.log(req.body);
    const { titulo, rating, premios, lanzamiento, nombre, nombregenero } = req.body;
    if (titulo == "" || rating == "" || premios == "" || lanzamiento == "" || nombre == "" || nombregenero == "") {
        let sql = 'SELECT a.idalbum, a.titulo, a.rating, a.premios, a.lanzamiento, g.nombregenero, i.nombre FROM dbmusica1.album a join dbmusica1.interprete i on a.interpreteid = i.idinterprete join dbmusica1.genero g on a.generoid = g.idgenero order';
        let validacionUpdt = 'Faltaron datos para actualizar el Album ' + [req.params.id] + '. Vuelva a intentar.';
        conexion.query(sql, (error, results) => {
            console.log(results);
            validacionUpdt
            res.render('album', {
                titulo: 'Album',
                results: results,
                validacionUpdt: validacionUpdt
            })
            if (error) throw error;
            res.render('album', {
                titulo: 'Album',
                results: results,
            })
        })
    } else {

        let generoidB = 0;
        let interpreteidN = 0
        let queryGeneroChanged = "SELECT idgenero FROM dbmusica1.genero where nombregenero = '" + nombregenero + "'";
        let queryInterpreteChanged = "SELECT idinterprete FROM dbmusica1.interprete where nombre = '" + nombre + "'";

        conexion.query(queryGeneroChanged, function (err, rows, fields) {
            if (rows.length > 0) {
                generoidB = rows[0].idgenero;
            } else {
                generoidB = nombregenero;
            }            
            conexion.query(queryInterpreteChanged, (err2, rows2, fields2) => {
                console.log(queryInterpreteChanged);
                console.log(rows2);
                console.log(nombre);
                console.log(interpreteidN);

                if (rows2.length > 0) {
                    interpreteidN = rows2[0].idinterprete;
                } else {
                    interpreteidN = nombre;
                }

                console.log(interpreteidN);

                let queryString = "UPDATE album SET titulo = '"
                    + titulo + "', rating = " + rating + ", premios = '"
                    + premios + "', lanzamiento = '" + lanzamiento +
                    "', generoid = " + generoidB + " , interpreteid = " + interpreteidN + " WHERE idalbum = " + [req.params.id];

                console.log(queryString);
                conexion.query(queryString, (err, rows, fields) => {
                    if (!err) {
                        res.redirect('/album');
                    }
                    else {
                        console.log(titulo);
                    }
                });

            });





        });


        // queryString = "UPDATE album SET titulo = '"
        // + titulo + "', rating = " + rating + ", premios = '"
        // + premios + "', lanzamiento = '" + lanzamiento + 
        // "', generoid = (SELECT idgenero FROM dbmusica1.genero where nombregenero = '"
        // + nombregenero + "' or idgenero = '" + nombregenero + "' ), interpreteid = (SELECT idinterprete FROM dbmusica1.interprete where nombre = '" 
        // + nombre + "' or idinterprete = '" + nombre + "') " + " WHERE idalbum = " + [req.params.id];

    };

};

module.exports = controller;