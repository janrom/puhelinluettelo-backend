const mongoose = require('mongoose')
const fs = require('fs')

// get login parameters
const file = fs.readFileSync('dbconf', 'utf-8')
const split = file.split(':')
const user = split[1]
const pass = split[3].substring(0, split[3].length - 1)

// connection string
const url = `mongodb://${user}:${pass}@ds159624.mlab.com:59624/fullstack-phonebook`

/**
 * Schema for Person model
 */
const Schema = mongoose.Schema
const personSchema = new Schema({
  'name': String,
  'number': String
})

/**
 * Format person object to match with frontend.
 * Usage <obj>.format(person)
 *
 * @see     https://mongoosejs.com/docs/api.html#schema_Schema-static
 * @param   instance (MongoDB document) of a Person model
 * @return  JSON
 */
personSchema.statics.format = function (person) {
  return ({
    'id': person._id,
    'name': person.name,
    'number': person.number
  })
}

/** 
 * Person model for a person in phone book.
 */
var Person = mongoose.model('Person', personSchema) 

/**
 * Wrapper for opening database connection using mongoose.connect.
 * Usage: <obj>.prototype.openDbConnection()
 *
 * @see     https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect
 * @return  function 
 */
Person.prototype.openDbConnection = () => {
  const options = { 'useNewUrlParser': true }
  mongoose
    .connect(url, options)
    .then(console.log('connected to database'))
}

/**
 * Wrapper for closing database connection using mongoose.close.
 * Usage: <obj>.prototype.closeDbConnection()
 *
 * @see     https://mongoosejs.com/docs/api.html#connection_Connection-close
 * @return  function
 */
Person.prototype.closeDbConnection = () => {
  mongoose.connection.close()
  console.log('database connection closed')
}

module.exports = Person
