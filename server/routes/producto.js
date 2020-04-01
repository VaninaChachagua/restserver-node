const express = require('express');
const { verificaToken } = require('../middlewares/authenticacion');

let app = express();
let Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {
    // tra todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productos
            });
        });

});

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!producto) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se encontró ese id producto'
                });
            }
            res.json({
                ok: true,
                producto
            });
        });

});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    //expresion regular
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});
//Crear producto
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });
});

//Actualizar producto
app.put('/producto/:id', verificaToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'No se encontró ese id producto'
            });
        }
        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.descripcion = body.descripcion;
        productoBD.categoria = body.categoria;
        productoBD.usuario = req.usuario._id;
        productoBD.disponible = body.disponible;
        productoBD.save((error, prodGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBD
            });
        });

    });
});



//Borrar producto, disponible a falso
app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;


    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró ese id producto'
                }
            });
        }
        productoBD.disponible = false;
        productoBD.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            });
        });

    });
});

module.exports = app;