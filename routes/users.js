const e = require('express');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('../services/jwt.service');
const _ = require('underscore');


const salt = bcrypt.genSaltSync(10);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const hash = bcrypt.hashSync(password, salt);

    const User = await db.User.create({ username: username, password: hash, email: email });
    return res.status(200).send({ data: User });
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;


    const User = await db.User.findOne({
      where: {
        email: email
      }
    });
    const result = bcrypt.compareSync(password, User.password)

    if (result == true) {
      const user = _.omit(User.dataValues, ['password', 'createdAt', 'updatedAt']); 

      const token = jwt.generateToken(user);

      return res.status(200).send({ token: token });
    } else {
      return res.status(401).send({ msg: "incorrect password" });
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
});


router.get('/allusers', async (req, res) => {
  try {
    const Users = await db.User.findAll();
    return res.status(200).send({ data: Users });
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
});

router.put('/edituser', jwt.checkJwt, async (req, res) => {
  try {
    const userdata = res.locals.verify;
    const username = req.body.username;
    const password = req.body.password;
    const User = await db.User.update({ username: username, password: password }, {
      where: {
        id: userdata.id
      }

    });
    return res.status(200).send({ msg: "user updated" });

  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
});

router.delete('/delete', jwt.checkJwt,  async (req, res) => {
  try {
    const userdata = res.locals.verify;
    const User = await db.User.destroy({
      where: {
        id: userdata.id
      }
    })
    return res.status(200).send({ msg: 'user deleted' });
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
});

router.get('/user', jwt.checkJwt, async (req, res) => {
  try {
    const userdata = res.locals.verify;
    const userId = req.params.id;
    const User = await db.User.findOne({
      where: {
        id: userdata.id
      }
    })
    return res.status(200).send({ data: User });
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
});


module.exports = router;
