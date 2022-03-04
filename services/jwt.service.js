
const jwt = require('jsonwebtoken');

const secretkey = 'test123456789';

const generateToken = (payload) => {

 return jwt.sign(payload, secretkey, {expiresIn: '8h'});

}
   
const verifyToken =  (token) => {
    if(!token) return {};
    return new Promise((resolve,reject) =>
        jwt.verify(token, secretkey, (err,decoded) => err ? reject({}) : resolve(decoded))
    );
}

const to = (promise) => {
    return promise.then(data => {
        return [null, data];
    }).catch(err => [err]);
}

const verifyBearerToken =  async (auth) => {
    const token = auth.split(' ')[1];
    const [err, verify] = await to(verifyToken(token));
    return {err, verify};
}

const checkJwt = async (req, res, next) => {
    const headers = req.headers;
    const auth = headers['authorization'];
    if (auth) {
        const {err, verify} = await verifyBearerToken(auth);
        if (err) {
            return res.status(401).send({message: 'Invalid Token'})
        } else {
           
                // logger.info('Request from ', verify.data, ' for ', req.method, req.url)
                res.locals.verify = verify;
                return next();
           
        }
    } else {
        return res.status(401).send({message: 'No Token Provided'})
    }
}

module.exports = {generateToken, checkJwt}