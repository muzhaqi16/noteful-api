const NotefulService = {
    getAllFolders(knex) {
        return knex.select('*').from('noteful_folders');
    },
    getFolderById(knex, id) {
        return knex.from('noteful_folders').select('*').where({ id }).first()
    }
    ,
    insertFolder(knex, newFolder) {
        return knex.insert(newFolder)
            .into('noteful_folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteFolder(knex, id) {
        return knex('noteful_folders')
            .delete()
            .where({ id })
    },
    getAllNotesByFolderId(knex, folderId) {
        return knex
            .select('*')
            .from('noteful_notes')
            .where('folderId', folderId);
    },
    getAllNotes(knex) {
        return knex.select('*').from('noteful_notes');
    },
    insertNote(knex, newNote) {
        return knex.insert(newNote)
            .into('noteful_notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getNoteById(knex, id) {
        return knex.from('noteful_notes').select('*').where({ id }).first()
    },
    deleteNote(knex, id) {
        return knex('noteful_notes')
            .where({ id })
            .delete()
    },
    updateNote(knex, id, newNote) {
        return knex('noteful_notes')
            .where({ id })
            .update(newNote)
    }
};
module.exports = NotefulService;