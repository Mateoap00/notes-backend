const requestLogger = (request, response, next) => {
    console.log('-----------------------------');
    console.log('Request method: ', request.method);
    console.log('Request body: ', request.body);
    console.log('Request params: ', request.params);
    console.log('-----------------------------');
    next();
};

const unknownEndpoint = (request, response) => {
    console.log('404 not found - unknown endpoint');
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};