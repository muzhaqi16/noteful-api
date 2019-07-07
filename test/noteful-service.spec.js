const NotefulService = require('../src/noteful-service')
const knex = require('knex')

describe('Noteful service object', function () {
    let db
    let testFolders = [
        { id: 1, name: 'Important' },
        { id: 2, name: 'Super' },
        { id: 3, name: 'Spangley' }
    ];

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    //before(() => db('noteful_folders').truncate())

    // before(() => {
    //     return db
    //         .into('noteful_folders')
    //         .insert(testFolders)
    // })

    after(() => db.destroy())

    describe('getAllFolders()', () => {
        it('resolves all folders from the noteful-folders table', () => {
            return NotefulService.getAllFolders(db)
                .then(actual => {
                    expect(actual).to.eql(testFolders)
                })
        })
    })
    it('inserts a new folder into the noteful_folders table', () => {
        const newFolder = { name: 'Artan' };

        return NotefulService.insertFolder(db, newFolder)
            .then(actual => {
                expect(actual).to.eql({ id: 4, name: 'Artan' })
            })
    })
})