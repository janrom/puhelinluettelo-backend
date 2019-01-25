/**
 * Phone book exercise for Full stack open 2018 course at https://fullstackopen.github.io/
 *
 * @author Janne Romppanen
 * @license CC BY-NC-SA 3.0 https://creativecommons.org/licenses/by-nc-sa/3.0/
 * @version 0.1
 */
const express = require('express')
const app = express()
app.use(express.static('build')) // use static files from frontend build

/**
 * MongoDB object representing a person in phone book
 */
const Person = require('./modules/person')

/**
 * middleware for allowing cross-origin resource sharing.
 * this is required for using resources (e.g. fonts) from another domain, port, protocol, etc. 
 * 
 * @see https://github.com/expressjs/cors
 */
const cors = require('cors')
app.use(cors())

/**
 * middleware for parsing incoming request bodies before route-handlers access them.
 * parsed data is in req.body-property.
 * 
 * @see https://github.com/expressjs/body-parser
 */
const bodyParser = require('body-parser')
app.use(bodyParser.json())

/**
 * middleware for logging all requests.
 *
 * @see https://github.com/expressjs/morgan
 */
const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body) )
app.use(morgan(':method :url :body :status :res[Content-Length] - :response-time ms'))

/** 
 * Route for getting server info
 *
 * @return {string} a number of persons stored in database with current date and time
*/
app.get('/info', (req, res) => {
  Person.prototype.openDbConnection()
  Person
    .countDocuments()
    .then(result => {
      Person.prototype.closeDbConnection()
      res.send(`<p>puhelinluettelossa ${result} henkilon tiedot</p><p>${new Date()}</p>`)
    })
    .catch(err => {
      console.log(err)
      res.status(500).end()
    })
})

/**
 * Route for getting all persons
 *
 * @return {JSON} all persons from database. JSON is formatted to match with frontend's JSON
 */
app.get('/api/persons', (req, res) => {
  Person.prototype.openDbConnection()
  Person 
    .find({}, { '__v': 0 })
    .then(persons => {
      Person.prototype.closeDbConnection()
      res.json(persons.map(person => Person.format(person)))
    })
    .catch(err => {
      console.log(err)
      res.status(500).end()
    })
})

/**
 * Route for getting a person by id
 *
 * @param {string} id of a person
 * @return {JSON} a person with matching id or HTTP status code
 */
app.get('/api/persons/:id', (req, res) => {
  Person.prototype.openDbConnection()
  Person
    .findById(req.params.id, { '__v': 0 })
    .then(person => {
      Person.prototype.closeDbConnection()
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).send({ error: 'malformatted id' })
    })
})

/**
 * Route for adding a new person.
 *
 * @return {JSON} a person that is saved to database or HTTP status code
 */
app.post('/api/persons', (req, res) => {
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })

  Person.prototype.openDbConnection()
  Person
    .init()
    .then(Person
      .create(newPerson)
      .then(Person.format)
      .then(createdAndFormattedPerson => {
        Person.prototype.closeDbConnection()
        res.json(createdAndFormattedPerson)
      })
      .catch(err => {
        console.log(err)
        if (err.code === 11000) { // MongoDB duplicate key error
          return res.status(409).send({ error: 'duplicate name error' }) 
        }
        res.status(400).send({ error: err.message })        
      })
    )
})

/**
 * Update person by id
 *
 * @param {string} id of a person to be updated
 * @return {JSON} updated person or HTTP status code
 */
app.put('/api/persons/:id', (req, res) => {
  Person.prototype.openDbConnection()
  Person
    .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true } )
    .then(updated => {
      Person.prototype.closeDbConnection()
      if (updated) {
        res.json(Person.format(updated))
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).send({ error: 'malformatted id' })
    })
})

/**
 * Delete person by id
 *
 * @param {string} id of a person 
 * @return {string} HTTP status code
 */
app.delete('/api/persons/:id', (req, res) => {
  Person.prototype.openDbConnection()
  Person
    .findOneAndDelete({ _id: req.params.id })
    .then(result => {
      Person.prototype.closeDbConnection()
      res.status(204).end()
    })
    .catch(err => {
      console.log(err)
      res.status(400).send({ error: 'malformatted id' })
    })
})

/**
 * middleware for handling requests for unknown routes
 */
const error = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(error)

/**
 * start dev server in specific port
 */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
