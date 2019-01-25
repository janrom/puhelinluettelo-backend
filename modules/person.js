/**
 * Phone book exercise for Full stack open 2018 course at https://fullstackopen.github.io/
 *
 * @author Janne Romppanen
 * @license CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
 * @version 0.1
 */
const mongoose = require('mongoose')
require('dotenv').config()

// connection string
const url = process.env.DB_URL_PROD 

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
