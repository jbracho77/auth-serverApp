const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renovarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Crear nuevo usuario
router.post( '/new',[
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3}).withMessage('El nombre debe contener al menos 3 caracteres'),
    check('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email ingresado no es valido'),
    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña es mínimo de 6 caracteres'),
    validarCampos
], crearUsuario );

// Inicio de sesión de usuario
router.post( '/',[
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria y mímimo de seis caracteres').isLength({ min: 6}),
    validarCampos
] ,loginUsuario );

// Validar y renovar token
router.get( '/renew', [ validarJWT ] ,renovarToken );

module.exports = router;


