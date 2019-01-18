const express = require('express')
const app = express()
app.use(express.static('build')) // use static files from frontend build
const Person = require('./modules/person')

/**
 * middleware for allowing cross-origin resource sharing.
 * this is required for using resources (e.g. fonts) from another domain, port, protocol, etc. 
 * https://github.com/expressjs/cors
 */
const cors = require('cors')
app.use(cors())

/**
 * middleware for parsing incoming request bodies before route-handlers access them.
 * parsed data is in req.body-property.
 * https://github.com/expressjs/body-parser
 */
const bodyParser = require('body-parser')
app.use(bodyParser.json())

/**
 * middleware for logging all requests.
 * https://github.com/expressjs/morgan
 */
const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body) )
app.use(morgan(':method :url :body :status :res[Content-Length] - :response-time ms'))

/*
 * format the person document before sending it to frontend
 */
const formatPerson = (person) => {
  return ({
    'id': person._id,
    'name': person.name,
    'number': person.number
  })
}

/* get server info
*/
app.get('/info', (req, res) => {
  Person.openDbConnection()
  Person.model
    .countDocuments()
    .then(result => {
      Person.closeDbConnection()
      res.send(`<p>puhelinluettelossa ${result} henkilon tiedot</p><p>${new Date()}</p>`)
    })
    .catch(err => console.log('catch error:', err))
})

/**
 * get all persons
 */
app.get('/api/persons', (req, res) => {
  Person.openDbConnection()
  Person.model 
    .find({}, { '__v': 0 })
    .then(persons => {
      res.json(persons.map(person => formatPerson(person)))
      Person.closeDbConnection()
    })
    .catch(err => {
      console.log('catch error:', err)
    })
})

/**
 * get person by id
 */
app.get('/api/persons/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(404).end
  }

  Person.openDbConnection()
  Person.model
    .findById(req.params.id, { '__v': 0 })
    .then(person => {
      if (!person) {
        res.send('<p>Valitettavasti henkilöä ei löytynyt.</p>')
      }
      Person.closeDbConnection()
      res.json(formatPerson(person))
    })
    .catch(err => console.log('catch error:', err))
})

/**
 * add new person to database.
 */
app.post('/api/persons', (req, res) => {
  // check input validity
  if ( !req.body.name || !req.body.number) {
    return res.json({ error: 'name or number is missing' })
  }
 
  const newPerson = Person.model({
    name: req.body.name,
    number: req.body.number
  })

  Person.openDbConnection()
  newPerson
    .save()
    .then(person => {
      console.log('person saved', person)
      Person.closeDbConnection()
      res.json(formatPerson(person))
    })
    .catch(err => console.log('catch error:', err))
})

/**
 * delete person by id
 */
app.delete('/api/persons/:id', (req, res) => {
  console.log('delete not implemented')
  res.status(501).end()
})

/**
 * middleware for handling unknown routes
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
