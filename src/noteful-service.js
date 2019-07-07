const NotefulService = {
    getAllFolders(knex) {
        return knex.select('*').from('noteful_folders');
    },
    insertFolder(knex, newFolder) {
        return knex.insert(newFolder)
            .into('noteful_folders')
            .returning('*')
            .then(rows => {
                return rows[1]
            })
    },
    getAllNotes(knex) {
        return knex.select('*').from('noteful_notes');
    },
    getAllNotesByFolderId(knex, folderId) {
        return knex
            .select('*')
            .from('noteful_notes')
            .where('folderId', folderId);
    },
    getNoteById(knex, noteId) {
        return knex
            .select('*')
            .from('noteful_notes')
            .where('id', noteId);
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