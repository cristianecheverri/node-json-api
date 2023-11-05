// Librerías externas
const express = require('express');
const cors = require('cors');
const { v4: uuid_v4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('./src/files');

const app = express();
const FILE_NAME = './db/books.txt';
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

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
// Listar Libros
app.get('/books', (req, res) => {
    const data = readFile(FILE_NAME);
    res.json(data);
})

//Crear Libro
app.post('/books', (req, res) => {
    try {
        //Leer el archivo de libros
        const data = readFile(FILE_NAME);
        //Agregar el nuevo libro (Agregar ID)
        const newBook = req.body;
        newBook.id = uuid_v4();
        console.log(newBook)
        data.push(newBook);
        // Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.json({ ok: true, message: 'Book successfully created' });
    } catch (error) {
        console.error(error);
        res.json({ ok:false, message: 'Failed book creating' });
    }
});

//Obtener un solo libro
app.get('/books/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const books = readFile(FILE_NAME)
    // Buscar el libro con el ID que recibimos
    const bookFound = books.find(book => book.id === id)
    if (!bookFound) {// Si no se encuentra el libro con ese ID
        res.status(404).json({ 'ok': false, message: "Book not found" })
        return;
    }
    res.json({ 'ok': true, book: bookFound });
})

//Actualizar un libro
app.put('/books/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const books = readFile(FILE_NAME)
    // Buscar el libro con el ID que recibimos
    const bookIndex = books.findIndex(book => book.id === id)
    if (bookIndex < 0) {// Si no se encuentra el libro con ese ID
        res.status(404).json({ 'ok': false, message: "Book not found" });
        return;
    }
    let book = books[bookIndex]; //Sacar del arreglo
    book = { ...book, ...req.body };
    books[bookIndex] = book; //Poner el libro en el mismo lugar
    writeFile(FILE_NAME, books);
    //Si el libro existe, modificar sus datos y almacenarlo nuevamente
    res.json({ 'ok': true, book: book });
})

//Eliminar un libro
app.delete('/books/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const books = readFile(FILE_NAME)
    // Buscar el libro con el ID que recibimos
    const bookIndex = books.findIndex(book => book.id === id)
    if (bookIndex < 0) {// Si no se encuentra el libro con ese ID
        res.status(404).json({ 'ok': false, message: "Book not found" });
        return;
    }
    //Eliminar el libro que esté en la posición petIndex
    books.splice(bookIndex, 1);
    writeFile(FILE_NAME, books)
    res.json({ 'ok': true });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
