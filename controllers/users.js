const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { response } = require('express')
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', {
        content: 1,
        date: 1
    })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    try {


        const { body } = request
        const { username, name, password } = body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)

    } catch (error) {
        response.status(400).json({ error })
    }
})

module.exports = usersRouter