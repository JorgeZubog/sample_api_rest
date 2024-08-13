const TokenExpiredError = require("jsonwebtoken/lib/TokenExpiredError")

const ERROR_HANLDERS = {
    CastError: response =>
        response.status(400).send({ error: 'id used is malformed' }),

    ValidatingError: (response, error) =>
        response.status(409).send({ error: error.messsage }),

    JsonWebTokenError: (response) =>
        response.status(401).json({ error: 'token missin or invalid' }),

    TokenExpiredError: res =>
        res.status(401).json({ error: 'token expired' }),

    defaultError: response =>
        response.status(500).end()
}

module.exports = (error, request, response, next) => {
    console.error(error)
    const handler = ERROR_HANLDERS[error.name] || ERROR_HANLDERS.defaultError

    handler(response, error)
}