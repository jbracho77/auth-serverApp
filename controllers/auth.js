const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

//Crear nuevo usuario
const crearUsuario = async (req, res = response) => {

    //console.log( req.body );
    const { name, email,  password} = req.body;
    //console.log( name, email, password );
    
    try {
        // Verificar el email
        const usuario = await Usuario.findOne({ email: email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }

        //Crear usuario con el modelo
        const dbUser = new Usuario( req.body );
        
        // Encriptar (mediante un Hash) la contraseña.
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );
        
        // Generar el JWT  
        const token = await generarJWT(dbUser.id, dbUser.name );

        // Crear usuario de DB
        await dbUser.save();

        //Generar repuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
        
    }


    
};

const loginUsuario = async (req, res = response) => {

    const { email, password} = req.body;

    try {

        const dbUser = await Usuario.findOne({ email });

        if ( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        // Confirmar la contraseña
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña inválida'
            });
        }

        // Generar el JWT  
        const token = await generarJWT(dbUser.id, dbUser.name );

        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });


        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
        
    }
};

const renovarToken = async (req, res = response) => {

    const { uid } = req;

    // Leer la BD para obtener el correo
    const dbUser = await Usuario.findById( uid );

    // Generar el JWT  
    const token = await generarJWT( uid, dbUser.name );

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    renovarToken
}

