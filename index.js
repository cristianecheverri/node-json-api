const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Rutas
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    res.send(`Hello ${formal ? 'Mr.' : ''} 
    ${name} ${type ? ' ' + type : ''}`);
});

app.post('/pets', (req, res) => {
    const reqBody = req.body;
    console.log(reqBody)
    res.send('Pet created');
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`)
});
