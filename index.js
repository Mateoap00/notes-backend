require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./models/note');

const app = express();

// MIDDLEWARE

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

const myLoggerMiddleware = (request, response, next) => {
    console.log('-----------------------------');
    console.log('Request method: ', request.method);
    console.log('Request body: ', request.body);
    console.log('Request params: ', request.params);
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

app.get('/api/notes/:id', (request, response, next) => {

    Note.findById(request.params.id).
        then(note => {

            if (note) {
                console.log('Note found: ', note);
                response.json(note);
            } else {
                console.log('404 note not found');
                response.status(404).end();
            }

        }).catch(error => next(error));
});

app.post('/api/notes', (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        date: new Date(),
        important: body.important || false
    });

    note.save()
        .then((savedNote) => {
            console.log('savedNote: ', savedNote);
            response.json(note);
        }).catch(error => next(error));
});

app.delete('/api/notes/:id', (request, response, next) => {

    Note.findByIdAndRemove(request.params.id)
        .then((result) => {
            console.log('Deleted successfully!');
            response.status(204).end();
        }).catch(error => next(error));
});

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body;

    Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
        .then((updatedNote) => {
            console.log('Updated note: ', updatedNote);
            response.json(updatedNote);
        }).catch(error => next(error));
})

// AFTER ROUTES MIDDLEWARE

const unknownEndpointMiddleware = (request, response) => {
    console.log('404 not found - unknown endpoint');
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpointMiddleware);

// ERROR HANDLER

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});