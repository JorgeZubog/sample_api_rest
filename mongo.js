const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const Note = require('./models/Note.js')

const contectionString = NODE_ENV == 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

mongoose.connect(contectionString)
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.error(err)
    })


process.on('uncaughtException', error => {
    console.error(error)
    mongoose.disconnect()
})

