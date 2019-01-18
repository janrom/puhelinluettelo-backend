const mongoose = require('mongoose')
const fs = require('fs')

// get login parameters
const file = fs.readFileSync('dbconf', 'utf-8')
const split = file.split(':')
const user = split[1]
const pass = split[3].substring(0, split[3].length - 1)

// connection string
const url = `mongodb://${user}:${pass}@ds159624.mlab.com:59624/fullstack-phonebook`

// connect to database
const options = { 'useNewUrlParser': true }
mongoose
  .connect(url, options)
  .then(console.log('connected to database'))

// MongoDB Model for a person in phone book
const PersonModel = mongoose.model('Person', {
  'name': String,
  'number': String
})

// create a new document from Person model
const createPerson = (name, number) => {
  const personDocument = new PersonModel({
    'name': name,
    'number': number
  })

  return personDocument
}

// save person document to database
const savePerson = (doc) => {
  doc
    .save()
    .then(person => {
      console.log('saved to database', person)
      closeDbConnection()
    })
}

// get all person documents from database
const getPersons = (model) => {
  model
    .find({})
    .then(persons => {
      persons.forEach((person) => {
        console.log(person)
      })
      closeDbConnection()
    })
}

const closeDbConnection = () => {
  mongoose.connection.close()
  console.log('database closed')
}

// values for creating a person document are given in terminal when starting node. Usage: node mongo.js name number
if (process.argv[2] && process.argv[3]) {
  const personDocument = createPerson(process.argv[2], process.argv[3])
  savePerson(personDocument)
} else {
  getPersons(PersonModel)
}
