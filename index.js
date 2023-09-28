// Librerías externas
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('./src/files');

const app = express();
const FILE_NAME = './db/pets.txt';

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Rutas DE PRUEBA
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    res.send(`Hello ${formal ? 'Mr.' : ''} 
    ${name} ${type ? ' ' + type : ''}`);
});

app.get('/read-file', (req, res) => {
    const data = readFile(FILE_NAME);
    res.send(data);
});

// API
// Listar Mascotas
app.get('/pets', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.json(data);
})

//Crear Mascota
app.post('/pets', (req, res) => {
    try {
        //Leer el archivo de mascotas
        const data = readFile(FILE_NAME);
        //Agregar la nueva mascota (Agregar ID)
        const newPet = req.body;
        newPet.id = uuidv4();
        console.log(newPet)
        data.push(newPet);
        // Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.json({ message: 'La mascota fue creada con éxito' });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar la mascota' });
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`)
});
