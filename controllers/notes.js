const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/info', (request, response) => {
    response.send('<h1>Hello Express from the notes app!</h1>');
});

notesRouter.get('/', (request, response) => {

    Note.find({}).then((notes) => {
        console.log('Notes: ', notes);
        response.json(notes);
    });

});

notesRouter.get('/:id', (request, response, next) => {

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

notesRouter.post('/', (request, response, next) => {
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

notesRouter.delete('/:id', (request, response, next) => {

    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            console.log('Deleted successfully!');
            response.status(204).end();
        }).catch(error => next(error));
});

notesRouter.put('/:id', (request, response, next) => {
    const { content, important } = request.body;

    const opt = { new: true, runValidators: true, context: 'query' };
    Note.findByIdAndUpdate(request.params.id, { content, important }, opt)
        .then((updatedNote) => {
            console.log('Updated note: ', updatedNote);
            response.json(updatedNote);
        }).catch(error => next(error));
});

module.exports = notesRouter;