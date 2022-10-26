require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./models/note');

const app = express();


let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    }
];

// MIDDLEWARE

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

const myLoggerMiddleware = (request, response, next) => {
    console.log('Request method: ', request.method);
    console.log('Request headers: ', request.headers);
    console.log('Request body: ', request.body);
    console.log('-----------------------------');
    next();
}


app.use(myLoggerMiddleware);

// ROUTES

app.get('/', (request, response) => {
    response.send('<h1>Hello Express!</h1>');
});

app.get('/api/notes', (request, response) => {

    Note.find({}).then((notes) => {
        console.log('Notes: ', notes);
        response.json(notes);
    });

});

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log(id);
    const note = notes.find(note => note.id === id);

    if (note) {
        console.log('Note found: ', note);
        response.json(note);
    } else {
        response.status(404).end();
    }

});

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);
    console.log('Notes after delete: ', notes);
    response.status(204).end();
});

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        console.log('400 Bad request');
        return response.status(400).json({
            error: "Content missing"
        });
    }

    const note = {
        id: generateId(),
        content: body.content,
        date: new Date(),
        important: body.important || false
    };
    console.log('New note:', note);

    notes = notes.concat(note);
    console.log('Notes after post: ', notes);

    response.json(note);
});

// AFTER ROUTES MIDDLEWARE

const unknownEndpointMiddleware = (request, response) => {
    console.log('404 not found - unknown endpoint');
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpointMiddleware);

// MY FUNCTIONS

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map((n) => {
            return n.id
        }))
        : 0;
    return maxId + 1;
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});