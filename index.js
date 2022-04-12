const express = require('express');
const app = express();
const Port = 3000 || 8080;
const path = require('path');
const hbs = require('hbs');
//Traemos la librería para la conexión
const mysql = require('mysql2');

const albumRoutes = require('./routes/album');
const { publicDecrypt } = require('crypto');


// //Creamos la configuración de la conexión
// const conexion =  mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "123456",
//     database: "dbmusica1",
// });

// //Conectamos a la DB
// conexion.connect((error) =>{
//     if(error) 
//     console.log(error);
//     else
//     console.log('Conexión a la Data Base exitosa!!');
// });


app.use(express.urlencoded({extended: false}))

app.use('/', albumRoutes);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

//Configuramos el Motor de Plantillas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// app.get('/', (req, res) =>{
//     res.render('index', {titulo: 'Bienvenidos a la App'})
// });

app.get('/formulario', (req, res) =>{
    res.render('formulario', {titulo: 'Formulario para Completar'})
});

// app.post('/formulario', (req, res) =>{
//     //Desestructuración de las variables
//     const { nombre, precio, descripcion } = req.body;
//         if(nombre == "" || precio == ""){
//         let validacion = 'Faltan datos para guardar el Producto';     
//         res.render('formulario', {
//             titulo: 'Formulario para Completar',
//             validacion
//         });
//     }else{
//         console.log(nombre);
//         console.log(precio);
//         console.log(descripcion);
//         //Insertar datos a la DB
//         let data = {
//             producto_nombre: nombre, 
//             producto_precio: precio,
//             producto_descripcion: descripcion
//         }
//         let sql = 'Insert into productos set ?';
//         conexion.query(sql, data, (error, results) =>{
//             if(error) throw error;
//             res.render('index', {
//                 titulo: 'Bienvenidos a la App',
//             }); 
//         })
//     }
// });

// app.get('/album', (req, res) =>{
//     let sql = 'SELECT * FROM album';
//     conexion.query(sql, (error, results) =>{
//         if(error) throw error;
//         res.render('album', {
//             titulo: 'Album',
//             results: results,        
//         })
//     })   
// });

app.post('/update', (req, res) =>{
    console.log(req.body.producto_nombre);
    console.log(req.body.producto_precio);
    console.log(req.body.producto_id);
    /*  res.send({
        Producto: req.body.producto_nombre,
        Precio: req.body.producto_precio
    })  */
    let sql = "UPDATE productos SET producto_nombre='" + req.body.producto_nombre + 
    "', producto_precio='" + req.body.producto_precio + "'WHERE producto_id=" + req.body.producto_id;

    conexion.query(sql, (error, results) =>{
        if(error) throw error;
        res.render('index', {
            titulo: 'Bienvenidos a la App',
        }); 
    }) 
});


// app.get('/delete', function(req, res) {
//     var prueba  = document.getElementsByClassName("rowToDelete").value;  
//     console.log(prueba);
// });

app.delete('/album/:id', (req, res) => {
    conexion.query('DELETE FROM album WHERE idalbum = ' + [req.params.id], (err, rows, fields)=>{
        if(!err)
        res.send('Registro borrado')
        else
        console.log(err);
    })
});


app.get('/delete/:idalbum', (req, res) =>{

    console.log(req)

    /*   res.send({
        Producto: req.body.producto_id,
        message: 'Producto eliminado de la DB'
    }) */
    
    // let sql = "DELETE FROM album WHERE idalbum=" + req.body.idalbum + "";
    // conexion.query(sql, (error, results) =>{
    //     if(error) throw error;
    //     res.render('album', {
    //         titulo: 'Bienvenidos a la App',
    //     }); 
    // })
})

app.get('/contacto', (req, res) =>{
    res.render('contacto', {titulo: 'Escríbenos'})
});

app.post('/contacto', (req, res) =>{
    //Desestructuración de las variables
    const { nombre, email } = req.body;     
    if(nombre == "" || email == ""){     
        let validacion = 'Faltan tus datos';       
        res.render('contacto', {
            titulo: 'Escríbenos',
            validacion
        });
    }else{
        console.log(nombre);
        console.log(email);
        res.render('index', {
            titulo: 'Bienvenidos a la App',
        }); 
    }
});

app.get('/administracion', (req, res) =>{
    res.render('administracion', {titulo: 'Bienvenido Administrador'})
});

//conexion.end();
app.listen(Port, () =>{
    console.log(`Servidor está trabajando en el Puerto ${Port}`);
});

app.on('error', (err) =>{
    console.log(`Error en la ejecución del Servidor ${error}`);
})





