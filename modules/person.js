/**
 * Phone book exercise for Full stack open 2018 course at https://fullstackopen.github.io/
 *
 * @author Janne Romppanen
 * @license CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
 * @version 0.1
 */

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
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true
  },
  number: {
    type: String,
    required: [true, 'number is required']
  }
})

/**
 * Format person object to match with frontend.
 *
 * @see     https://mongoosejs.com/docs/api.html#schema_Schema-static
 * @param   {object} MongoDB document representing a person
 * @return  {JSON}
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
 *
 * @see     https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect
 * @return  function 
 */
Person.prototype.openDbConnection = () => {
  const options = { 'useNewUrlParser': true }
  mongoose
    .connect(url, options)
    .then(console.log('connected to database'))
    .catch(err => console.log(err))
}

/**
 * Wrapper for closing database connection using mongoose.close.
 *
 * @see     https://mongoosejs.com/docs/api.html#connection_Connection-close
 * @return  function
 */
Person.prototype.closeDbConnection = () => {
  mongoose.connection.close()
  console.log('database connection closed')
}

module.exports = Person
