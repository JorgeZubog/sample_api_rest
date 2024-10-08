const mongoose = require('mongoose')
const { server } = require('../index')
const bycypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')

describe('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bycypt.hash('pswd', 10)
        const user = new User({ username: 'jorgeroot', name: "jorge", passwordHash })

        await user.save()
    })

    test('works as expected creating a fresh user', async () => {
        const userAtStart = await getUsers()

        const newUser = {
            username: 'yuss',
            name: 'yuss',
            password: 'tw1tch'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsers()

        expect(usersAtEnd).toHaveLength(userAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)

    })

    test('creation fails with proper statuscode and message if username is already taken', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'jorgeroot',
            name: 'jorgeTest',
            password: 'jorgetest'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error.errors.username.message).toContain('`username` to be unique')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    afterAll(() => {
        mongoose.connection.close()
        server.close()
    })
})

