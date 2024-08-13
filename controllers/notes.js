const notesRouter = require('express').Router()
const { response } = require('express')
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
    //When there is not async use a promise instead
    Note.find({})
        .populate('user', {
            username: 1,
            name: 1
        })
        .then(notes => {
            response.status(200).json(notes
                /*DO NOT WORK
                notes.map(note => {
                const { _id, __v, ...restOfNote } = note
                return {
                    ...restOfNote,
                    id: _id
                }
            })*/
            )
        })

    //When there is an async in the callback
    // const notes = await Note.find({}).populate('user', {
    //     username: 1,
    //     name: 1
    // })
    // response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
    //const id = Number(request.params.id)
    const { id } = request.params

    console.log('get ' + id.toString())
    //const note = notes.find(note => note.id == id) NO LONGER NEED BECAUSE A NEW DB
    Note.findById(id)
        .then(result => {
            return result
                ? response.status(200).json(result)
                : response.status(404).end()
        })
        .catch(error => next(error))
    //.then(note => {
    // if (note) {
    //     response.status(200).json(note)
    // } else {
    //     response.status(404).end()
    //     }
    // }).catch(err => {
    //     next(err)
    // })
})

notesRouter.post('/', async (request, response, next) => {
    const {
        content,
        important = false,
        userId
    } = request.body

    const user = await User.findById(userId)

    if (!content) {
        response.status(400).json({
            error: "note.content is missing"
        })
        console.log("note.content is missing")
        return
    }

    //const ids = notes.map(note => note.id)
    //const maxId = Math.max(...ids);

    // const newNote = {
    //     id: maxId + 1,
    //     content: note.content,
    //     date: new Date().toISOString()
    // }

    const newNote = new Note({
        content,
        date: new Date(),
        important,
        user: user._id
    })

    // Raplace by async code 
    // newNote.save().then(saveNote => {
    //     response.status(201).json(saveNote)
    // }).catch(err => next(err))

    try {
        const savedNote = await newNote.save()

        user.notes = user.notes.concat(savedNote._id)
        await user.save()

        response.status(201).json(savedNote)
    } catch (error) {
        next(error)
    }

    console.log('post ' + newNote)

    //notes = [...notes, newNote] NO LONGER NEED BECAUSE A NEW DB

    //response.status(201).json(newNote)
})

notesRouter.put('/:id', (request, response, next) => {
    const { id } = request.params
    const note = request.body

    const newNoteInfo = {
        content: note.content,
        date: new Date(),
        important: note.important || false
    }

    console.log('update ' + id.toString())
    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
        .then(result => {
            response.status(202).json(result)
        }).catch(error => next(error))

})

notesRouter.delete('/:id', (request, response, next) => {
    // const id = Number(request.params.id) NO LONGER NEED BECAUSE A NEW DB
    const { id } = request.params
    console.log('delete ' + id.toString())
    Note.findByIdAndDelete(id)
        .then(result => {
            response.status(204).json(result).end()
        }).catch(error => next(error))

    // notes = notes.filter(note => note.id != id) NO LONGER NEED BECAUSE A NEW DB
    //response.status(204).end()
})

module.exports = notesRouter