// Used for testing and configuring

const mongoose = require('mongoose')

//eslint-disable-next-line
if (process.argv.length < 3) {
    console.log('Pls provide pass as argument: node mongo.js <password>')
    //eslint-disable-next-line
    process.exit(1)
}

//eslint-disable-next-line
const password = process.argv[2]
//eslint-disable-next-line
const name = process.argv[3]
//eslint-disable-next-line
const number = process.argv[4]

const url = `mongodb+srv://alpo:${password}@cluster0.raufj.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number,
})

const saveToDb = () => {
    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}


const displayPhonebook = () => {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

name ? saveToDb() : displayPhonebook()