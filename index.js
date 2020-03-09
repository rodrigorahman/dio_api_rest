const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const port = 3000;
const SECRET = 'oResEp&OP#wR';
const contatos = require('./contatos.json');

function checkPermission(req, res, next) {
    if (req.path !== '/login') {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).send({ message: 'Token não informado' });

        jwt.verify(token, SECRET, function (err, decoded) {
            if (err) return res.status(500).send({ message: 'Acesso Negado' });
            req.userId = decoded.id;
            next();
        });

    } else {
        next();
    }
}

app.use(express.json());
app.use(checkPermission);
app.listen(port, () => {
    console.log('Servidor Iniciado');
});

app.post('/login', (req, res) => {
    if (req.body.username === 'rodrigorahman' && req.body.password === 'rahman') {
        const id = '1';
        const token = jwt.sign({ id }, SECRET, {
            expiresIn: 300
        });
        res.send({ token });

    } else {
        res.status(403).send({ message: 'Acesso Negado' });
    }
});

app.get('/contatos', (req, res) => {
    res.send(contatos);
});

app.get('/contatos/filtrar', (req, res) => {
    const queryNome = req.query.nome;
    const contatosFiltrados = contatos
    .filter(c => c.nome_completo.toLowerCase().includes(queryNome.toLowerCase()));
    res.send(contatosFiltrados);
});