const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const { initialNotes, api, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
    await Note.deleteMany({})

    //Add notes sequential controled order
    for (const note of initialNotes) {
        const noteObject = new Note(note)
        await noteObject.save()
    }

    //Add notes parellel fast but not predictable
    // const notesObjects = initialNotes.map(note => new Note(note))
    // const promises = notesObjects.map(note => note.save())
    // await Promise.all(promises)

    // Add notes manually
    // const note1 = new Note(initialNotes[0])
    // await note1.save()
    // const note2 = new Note(initialNotes[1])
    // await note2.save()

})

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('notes are two notes', async () => {
    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about MongoDB', async () => {
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain("MongoDB es increible")
})

test('a valide note can be added', async () => {
    const newNote = {
        content: "new Test note",
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain("new Test note")
})

test('a note without content is not added', async () => {
    const newNoteNonContent = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNoteNonContent)
        .expect(400)

    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
})

test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const { contents, response: secondResponse } = await getAllContentFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.id)
})

test('a note that do not exist can not be deleted', async () => {

    await api
        .delete(`/api/notes/123456Z`)
        .expect(400)

    const { contents, response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
    mongoose.connection.close()
    server.close()
})