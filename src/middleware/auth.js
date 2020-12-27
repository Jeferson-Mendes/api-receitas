
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) { // Verifica se foi informado um token
        return res.status(401).send({error: 'No token provided'}) 
    }

    const parts = authHeader.split(' ');
    if(!parts.length === 2){
        return res.status(401).send({error: 'Token error'})
    }

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)){ // Verificando se existe a palavra "Bearer" na parte scheme.
        return res.status(401).send({ error: 'Token malformatted' });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send({error: 'Token invalid'});

        req.userId = decoded.id;
        req.username = decoded.username;
        return next()
    })

}