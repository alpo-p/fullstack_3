//eslint-disable-next-line
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', req => JSON.stringify(req.body))

app.get('/info', (req, res, next) => {
    Person.find({}).then(people => {
        const amount = people.length
        const time = new Date()
        res.send(`Phonebook has info for ${amount} people <br/><br/> ${time}`)
    })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => person!==null ? res.json(person) : res.status(404).end())
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(person => person!==null ? res.status(204).end() : res.status(404).end())
        .catch(error => next(error))
})

// Used in previous version of the app //
//const generateId = (start, end) => {
//    return Math.floor(Math.random() * end) + start
//}

app.post('/api/persons/', (req,res, next) => {
    const body = req.body

    if (!body.name)
        return res.status(400).json({ error: 'name missing' })

    if (!body.number)
        return res.status(400).json({ error: 'number missing' })

    // Working version before adding db support //
    //if (persons.some(person => person.name === body.name))
    //    return res.status(400).json({ error: 'name must be unique' })
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedPerson => {
            res.json(savedAndFormattedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => res.json(updatedPerson.toJSON()))
        .catch(error => next(error))
})


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

//eslint-disable-next-line
const PORT = process.env.PORT
app.listen(PORT, () => console.log('Server running on ', PORT) )