const express = require('express')
const app = express()
app.use(express.static('build')) // use static files from frontend build
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
 * @return  String
*/
app.get('/info', (req, res) => {
  Person.prototype.openDbConnection()
  Person
    .countDocuments()
    .then(result => {
      Person.prototype.closeDbConnection()
      res.send(`<p>puhelinluettelossa ${result} henkilon tiedot</p><p>${new Date()}</p>`)
    })
    .catch(err => console.log('catch error:', err))
})

/**
 * Route for getting all persons
 *
 * @return  JSON with all persons in database
 */
app.get('/api/persons', (req, res) => {
  Person.prototype.openDbConnection()
  Person 
    .find({}, { '__v': 0 })
    .then(persons => {
      // format found data and send response as json
      res.json(persons.map(person => Person.format(person)))
      
      Person.prototype.closeDbConnection()
    })
    .catch(err => {
      console.log('catch error:', err)
    })
})

/**
 * Route for getting a person by id
 *
 * @return  JSON
 */
app.get('/api/persons/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(404).end
  }

  Person.prototype.openDbConnection()
  Person
    .findById(req.params.id, { '__v': 0 })
    .then(person => {
      if (!person) {
        res.send('<p>Valitettavasti henkilöä ei löytynyt.</p>')
      }
      Person.prototype.closeDbConnection()
      res.json(Person.format(person))
    })
    .catch(err => console.log('catch error:', err))
})

/**
 * Route for adding a new person.
 *
 * @return  JSON
 */
app.post('/api/persons', (req, res) => {
  // check input validity
  if ( !req.body.name || !req.body.number) {
    return res.json({ error: 'name or number is missing' })
  }
 
  const newPerson = Person({
    name: req.body.name,
    number: req.body.number
  })

  Person.prototype.openDbConnection()
  newPerson
    .save()
    .then(person => {
      Person.prototype.closeDbConnection()
      res.json(Person.format(person))
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
