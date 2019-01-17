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

// MongoDB Object for contacts in phone book
const Contact = mongoose.model('Contact', {
  'name': String,
  'number': String
})

// create new Contact document
const createContact = (name, number) => {
  const contact = new Contact({
    'name': name,
    'number': number
  })

  return contact
}

// save contact document to database
const saveContact = (doc) => {
  doc
    .save()
    .then(result => {
      console.log('saved to database', doc)
      closeDbConnection()
    })
}

// get all contact documents from database
const getContacts = (model) => {
  model
    .find({})
    .then(result => {
      result.forEach((contact) => {
        console.log(contact)
      })
      closeDbConnection()
    })
}

const closeDbConnection = () => {
  mongoose.connection.close()
  console.log('database closed')
}

// contact values are given in node parameters. Usage: node mongo.js name number
if (process.argv[2] && process.argv[3]) {
  const contact = createContact(process.argv[2], process.argv[3])
  saveContact(contact)
} else {
  getContacts(Contact)
}
