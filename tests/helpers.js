const supertest = require('supertest')
const { app } = require('../index')

const api = supertest(app)

const initialNotes = [
    {
        "content": "MongoDB es increible",
        "date": "2024-07-25T12:30:31.538+00:00",
        "important": true
    },
    {
        "content": "MongoDB es increible",
        "date": "2024-07-25T12:30:31.538+00:00",
        "important": true
    },
    {
        "content": "agregar otra nota",
        "date": "2024-07-25T12:30:31.538+00:00",
        "important": false
    }
]

const getAllContentFromNotes = async () => {
    const response = await api.get('/api/notes')
    return {
        contents: response.body.map(note => note.content),
        response
    }
}

module.exports = { api, initialNotes, getAllContentFromNotes }