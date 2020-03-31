const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Para validar el token de google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioBD
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        //expiresIn: 60s * 60m * 24h * 30d - expira en 30 días
        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });

});

//Configuraciones de Google - regresa una promesa
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    //Con esto ya tenemos toda la información del usuario
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}


app.post('/google', async(req, res) => {
    //obtengo token
    let token = req.body.idtoken;
    //obtengo la información del payload, es decir todos los datos del usuario
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
    //Debería validar si no existe ya ése usuario
    Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: e
            });
        }
        //Reviso si se autenticó con google
        if (usuarioBD) {
            if (usuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                });
            } else {
                //usuario de google
                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token,
                });
            }
        } else {
            //Si el usuario no existe en BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.img = googleUser.img;
            usuario.email = googleUser.email;
            usuario.google = true;
            //Como el campo es obligatorio, nunca va a hacer match con nuestra base
            usuario.password = ':)';
            //lo grabo
            usuario.save(err, usuarioBD => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                //usuario de google
                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token,
                });
            });
        }
    });
});

module.exports = app;