const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/authenticacion');
let app = express();
let Categoria = require('../models/categoria');
const _ = require('underscore');

//Mostrar todas las categorias
app.get('/categorias', verificaToken, (req, res) => {
    Categoria.find({ estado: true }, 'descripcion categoria')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});

//Mostrar todas las categorias como en udemy
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});

//Mostrar una categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById();
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaId) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaId) {
            return res.status(500).json({
                ok: false,
                message: 'La categoría no existe'
            });
        }
        res.json({
            ok: true,
            categoria: categoriaId
        });
    });
});

//Crear una categoria
app.post('/categoria', verificaToken, (req, res) => {
    //Retornar la nueva categoria
    // id de la persona que lo creó
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((error, categoriaBD) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo agregar la nueva categoria',
                error
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });
});

//Actualizar la categorias
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let actualizaCateg = {
        descripcion: body.descripcion
    };
    //para que no nos choque con las validaciones {new: true, runValidators: true}
    Categoria.findByIdAndUpdate(id, actualizaCateg, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo actualizar la categoria',
                error
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

//Borrar una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Sólo puede borrarla un administrador
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    Categoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });

});



module.exports = app;