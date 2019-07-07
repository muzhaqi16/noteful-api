const express = require('express')
const xss = require('xss')
const NotefulService = require('../noteful-service');

const notesRouter = express.Router();
const jsonParser = express.json()

const serializeNote = note => ({
    id: note.id,
    name: xss(note.name),
    content: xss(note.content),
    modified: note.modified,
    folderid: note.folderid
})

notesRouter
    .route('/')
    .get((req, res, next) => {
        NotefulService.getAllNotes(
            req.app.get('db')
        )
            .then((notes) => {
                res.json(notes)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, content, folderid } = req.body;
        const newNote = { name, content, folderid }

        if (!name || !content || !folderid) {
            return res.status(400).json({
                error: { message: `Missing 'title','content' or 'folderid' in request body` }
            })
        }
        NotefulService.insertNote(req.app.get('db'), newNote)
            .then(note => {
                res
                    .status(201)
                    .json(note)
            })
            .catch(next)
    })

notesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        NotefulService.getNoteById(
            req.app.get('db'),
            req.params.note_id
        )
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: `Note doesn't exist` }
                    })
                }
                res.note = note
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeNote(res.note))
    })
    .delete((req, res, next) => {
        NotefulService.deleteNote(
            req.app.get('db'),
            req.params.note_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, content, folderid } = req.body
        const noteToUpdate = { name, content, folderid }

        const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'name', 'content' or 'folderid'`
                }
            })

        NotefulService.updateNote(
            req.app.get('db'),
            req.params.note_id,
            noteToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
module.exports = notesRouter;