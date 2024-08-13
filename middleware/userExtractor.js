const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
    const authorization = request.get('authorization')
    let token = null
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        //auth = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YmIxZjMzZTM3YTYyODc2YmQzZGUyMSIsInVzZXJuYW1lIjoiSm9yZ2UiLCJpYXQiOjE3MjM1NDE3ODN9.nZD4fcpkl2RKrDp1PX0bpS7kJDP5hwLznDNgaSasy0E"
        token = authorization.substring(7)
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const { id: userId } = decodedToken

    request.userId = userId

    next()
}