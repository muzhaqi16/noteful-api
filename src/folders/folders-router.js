const express = require('express')
const xss = require('xss');
const NotefulService = require('../noteful-service');

const folderRouter = express.Router();
const jsonParser = express.json()

folderRouter
    .route('/')
    .get((req, res, next) => {
        NotefulService.getAllFolders(
            req.app.get('db')
        )
            .then((folders) => {
                res.json(folders)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const name = req.body;
        if (!name) {
            return res.status(400).json({
                error: { message: `Missing 'name' in the request body` }
            })
        }
        NotefulService.insertFolder(req.app.get('db'), name)
            .then(folder => {
                res
                    .status(201)
                    .json(folder)
            })
            .catch(next)
    })
folderRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        NotefulService.getFolderById(
            req.app.get('db'),
            req.params.folder_id
        )
            .then(folder => {
                if (!folder) {
                    return res.status(404).json({
                        error: { message: `Folder doesn't exist` }
                    })
                }
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        NotefulService.getFolderById(
            req.app.get('db'),
            req.params.folder_id
        )
            .then(folder => {
                res.json(folder)
            })
    })
    .delete((req, res, next) => {
        NotefulService.deleteFolder(
            req.app.get('db'),
            req.params.folder_id
        ).then(() => {
            res.status(204).end()
        })
            .catch(next)
    })
module.exports = folderRouter;