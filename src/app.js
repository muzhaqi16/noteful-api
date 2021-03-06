require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const knex = require('knex');
const { NODE_ENV } = require('./config')
const folderRouter = require('./folders/folders-router');
const notesRouter = require('./notes/notes-router');
const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})


app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use('/folders', folderRouter);
app.use('/notes', notesRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV == 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
});

module.exports = app;