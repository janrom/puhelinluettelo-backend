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
exports.openDbConnection = () => {
  const options = { 'useNewUrlParser': true }
  mongoose
    .connect(url, options)
    .then(console.log('connected to database'))
}

exports.closeDbConnection = () => {
  mongoose.connection.close()
  console.log('database connection closed')
} 

// MongoDB Model for a person in phone book
exports.model = mongoose.model('Person', {
  'name': String,
  'number': String
})
