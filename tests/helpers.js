const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')
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

const getUsers = async () => {
    const userDB = await User.find({})
    return userDB.map(user => user.toJSON())
}

module.exports = {
    api,
    initialNotes,
    getAllContentFromNotes,
    getUsers
}