const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log("Server running on ", PORT);
})

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "050-123123",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "050-123321"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "050-123331"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "050-120321"
    },
]

app.get('/info', (req, res) => {
    const amount = persons.length
    time = new Date()
    res.send(`Phonebook has info for ${amount} people <br/><br/> ${time}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = (start, end) => {
    return Math.floor(Math.random() * end) + start
}

app.post('/api/persons/', (req,res) => {
    const body = req.body

    if (!body.name)
        return res.status(400).json({ error: 'name missing' })

    if (!body.number)
        return res.status(400).json({ error: 'number missing' })

    if (persons.some(person => person.name === body.name))
        return res.status(400).json({ error: 'name must be unique' })
    
    const person = {
        id: generateId(1,1000000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})