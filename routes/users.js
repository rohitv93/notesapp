var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('../services/jwt.service');
const _ = require('underscore');
const schema = require('../schema/index');
const redisService = require('../services/redis.service')

const salt = bcrypt.genSaltSync(10);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const { error, value } = schema.users.userSchema.validate( data );
    if (error){
      return res.status(400).send(error.message)
    }
    
    const hash = bcrypt.hashSync(data.password, salt);

    const User = await db.User.create({ username: data.username, password: hash, email: data.email });
    return res.status(200).send({ data: User });
  }
  catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = req.body;
    const { error, value } = schema.users.loginSchema.validate( data );
    if (error){
      return res.status(400).send(error.message)
    }


    const User = await db.User.findOne({
      where: {
        email: data.email
      }
    });
    if(!User){
      return res.status(400).send({msg: 'Invalid username'})
    }
    const result = bcrypt.compareSync(data.password, User.password)

    if (result == true) {
      const user = _.omit(User.dataValues, ['password', 'createdAt', 'updatedAt']); 

      const token = jwt.generateToken(user);

      const sData = redisService.setData(token, data.email);

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

router.get('/logout', jwt.checkJwt, async (req, res) => {
   const headers = req.headers;
   const auth = headers['authorization'];
   const token = auth.split(' ')[1];

   const dData = await redisService.delData(token);
   return res.status(200).send({msg: 'logout succesfull' });
})


module.exports = router;
