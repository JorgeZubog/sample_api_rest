const mongoose = require('mongoose')
const Note = require('./models/Note.js')

const contectionString = process.env.MONGO_DB_URI

mongoose.connect(contectionString)
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.error(err)
    })


process.on('uncaughtException', () => {
    mongoose.connection.disconnect()
})

