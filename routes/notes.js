const e = require('express');
var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
const db = require('../models');
const jwt = require('../services/jwt.service');
const schema = require('../schema/index');



router.post('/makenote', jwt.checkJwt, async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const { error, value } = schema.notesschema.validate( data );
        if (error){
            return res.status(400).send(error.message)
        }
        const date = new Date()
        const userdata = res.locals.verify;
        const note = await db.Note.create({ userId: userdata.id, title: data.title, body: data.body, date: date });
        return res.status(200).send({ data: note });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ msg: err.message });
    }
});

router.get('/allnotes', jwt.checkJwt, async (req, res) => {
    try {
        const userdata = res.locals.verify;
        const notes = await db.Note.findAll({
            where: {
                userId: userdata.id
            }
        });
        return res.status(200).send({ data: notes });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ msg: err.message });
    }
});

router.get('/note/:id', jwt.checkJwt, async (req, res) => {
    try {
        const userdata = res.locals.verify;
        const notesid = req.params.id;
        const note = await db.Note.findOne({
            where: {
                userId: userdata.id,
                id: notesid
            }
        })
        return res.status(200).send({ data: note });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ msg: err.message });
    }
});

router.put('/editnote/:id', jwt.checkJwt, async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const { error, value } = schema.notesschema.validate( data );
        if (error){
            return res.status(400).send(error.message)
        }
        const userdata = res.locals.verify;
        const notesid = req.params.id;
        
        const note = await db.Note.update({ title: data.title, body: data.body, image: data.image }, {
            where: {
                userId: userdata.id,
                id: notesid
            }
        });
        return res.status(200).send({ msg: "note edited" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ msg: err.message });
    }
});

router.delete('/delete/:id', jwt.checkJwt, async (req, res) => {
    try {
        const userdata = res.locals.verify;
        const notesid = req.params.id;
        const note = await db.Note.destroy({
            where: {
                userId: userdata.id,
                id: notesid
            }

        })
        return res.status(200).send({ msg: 'note deleted' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ msg: err.message });
    }
});

module.exports = router;
