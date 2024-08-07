//Load enviroment
require('dotenv').config()

//Connection direct to mongoDB without caching
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')


app.use(cors())
app.use(express.json())

app.use(logger)

// let notes = [ //NO LONGER NEED BECAUSE A NEW DB
// {
//     "userId": 1,
//     "id": 1,
//     "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
//     "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
// },
// {
//     "userId": 1,
//     "id": 2,
//     "title": "qui est esse",
//     "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
// },
// {
//     "userId": 1,
//     "id": 3,
//     "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
//     "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
// }
// ]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', /*async*/(request, response) => {
    Note.find({}).then(notes => {
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

    //if there is a async in the callback
    // const notes = await Note.find({})
    // response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
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

app.post('/api/notes/', async (request, response, next) => {
    const note = request.body
    if (!note || !note.content) {
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
        content: note.content,
        date: new Date(),
        important: note.important || false
    })

    // Raplace by async code 
    // newNote.save().then(saveNote => {
    //     response.status(201).json(saveNote)
    // }).catch(err => next(err))

    try {
        const savedNote = await newNote.save()
        response.status(201).json(savedNote)
    } catch (error) {
        next(error)
    }

    console.log('post ' + newNote)

    //notes = [...notes, newNote] NO LONGER NEED BECAUSE A NEW DB

    //response.status(201).json(newNote)
})

app.put('/api/notes/:id', (request, response, next) => {
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

app.delete('/api/notes/:id', (request, response, next) => {
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

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})

module.exports = { app, server }