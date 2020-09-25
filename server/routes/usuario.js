const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require ('../models/usuario');
const app = express();

app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0; // Genera un String 
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true}, 'nombre email role estado')
    .skip(desde)
    .limit(limite)    
    .exec((err, usuarios,)=>{
        if (err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        Usuario.countDocuments({estado: true}, (err, conteo)=>{

            res.json({
                ok:true,
                usuarios,
                cuantos: conteo
            })
        })

        // res.json({
        //     ok:true,
        //     usuarios
        // })
    }) 
    
    // res.json('getUsuario LOCAL!!!')
  })
  
  app.post('/usuario', function (req, res) {
      let body = req.body;

      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync(body.password,10),
          role: body.role
      });

      usuario.save((err, usuarioDB) => {
        if (err){
            return res.status(400).json({
                ok:false,
                err
            })
        } 

            res.json({
                ok: true,
                usuario: usuarioDB
            })

        
      });
    //   if ( body. nombre === undefined ){
    //       res.status(400).json({
    //           ok: false,
    //           mensaje: 'El nombre es necesario'
    //       })
          
    //   }else {
    //       res.json({
    //           persona:body
    //       });
    //   }
      
    });
  
    app.put('/usuario/:id', function (req, res) {
        let id = req.params.id;
        // let body = req.body; // Obtenemos la información del BODY
        let body = _.pick(req.body,[
            'nombre',
            'email',
            'img',
            'role',
            'estado'
        ]);

        // delete body.password;  // 
        // delete body.google;

        Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true },(err, usuarioDB)=>{
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            } 
    
                res.json({
                    ok: true,
                    usuario: usuarioDB
                })
        })
    //   res.json({
    //       id
    //   })
    })
  
    app.delete('/usuario/:id', function (req, res) {
    //   res.json('deleteUsuario')
        let id = req.params.id; 
        let cambiaEstado = {
            estado: false
        }

        Usuario.findByIdAndUpdate(id,cambiaEstado,{ new: true },(err, usuarioDB) => {
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            } 
            // Segun deberia funcionar tambien con if (!usuarioDB){ pero no funciona OBVIO XD
            if (usuarioDB.estado === false){
                        return res.status(400).json({
                            ok:false,
                            err: {
                                message: 'Usuario no existe'
                            }
                        })
                }
    
                res.json({
                    ok: true,
                    usuario: usuarioDB
                })
        
        })
        // Delete user db
        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        //     if (err){
        //         return res.status(400).json({
        //             ok:false,
        //             err
        //         })
        //     }

        //     if (!usuarioBorrado){
        //         return res.status(400).json({
        //             ok:false,
        //             err: {
        //                 message: 'Usuario no encontrado'
        //             }
        //         })
        //     }

        //     res.json({
        //         ok:true,
        //         usuario: usuarioBorrado
        //     })
        // })


    })

module.exports= app;