const express = require('express')
const router = express.Router();   
const app = express();

// const albumController = require('../src/controllers/albumController')
const albumController = require('../src/controllers/albumController');
const emailController = require('../src/controllers/emailController');


// router.get('/', albumController.list)

router.get('/', (req, res) =>{
    res.render('index', {titulo: 'Bienvenidos a la App'})
});

router.get('/delete/:id', albumController.delete);
router.get('/album/', albumController.list);
router.post('/create', albumController.create);
router.post('/update/:id', albumController.update);
router.post('/contacto', emailController.contacto);




module.exports = router;