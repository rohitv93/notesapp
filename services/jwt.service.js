const jwt = require('jsonwebtoken');
const redisService = require('../services/redis.service');
require('dotenv').config();

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '8h' });
}

const verifyToken = (token) => {
    if (!token) return {};
    return new Promise((resolve, reject) =>
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => err ? reject({}) : resolve(decoded))
    );
}

const to = (promise) => {
    return promise.then(data => {
        return [null, data];
    }).catch(err => [err]);
}

const verifyBearerToken = async (auth) => {
    const token = auth.split(' ')[1];
    const [err, verify] = await to(verifyToken(token));
    return { err, verify };
}

const checkJwt = async (req, res, next) => {
    const headers = req.headers;
    const auth = headers['authorization'];
    const token = auth.split(' ')[1];
    if (auth) {
        const gData = await redisService.getData(token);
        if (!gData) {
            return res.status(403).send({ message: 'request forbidden' });
        }
        const { err, verify } = await verifyBearerToken(auth);
        if (err) {
            return res.status(401).send({ message: 'Invalid Token' })
        } else {
            res.locals.verify = verify;
            return next();
        }
    } else {
        return res.status(401).send({ message: 'No Token Provided' })
    }
}

module.exports = { generateToken, checkJwt }