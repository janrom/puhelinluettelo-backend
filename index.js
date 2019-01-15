const express = require('express')
const app = express()

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

/**
 * hardcoded persons-data
 */
let persons = [
  {
    id: 1,
    name: "Janne Romppanen",
    number: "123123"    
  },
  {
    id: 2,
    name: "Niilo Nikander",
    number: "321123"    
  },
  {
    id: 3,
    name: "Keijo Kuusisto",
    number: "654456"    
  },
  {
    id: 4,
    name: "Minna Mallikas",
    number: "423234"    
  }  
]

/**
* get server info
*/
app.get('/info', (req, res) => {
  res.send(`<p>puhelinluettelossa ${persons.length} henkilon tiedot</p><p>${new Date()}</p>`)
})

/**
 * get all persons
 */
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

/**
 * get person by id
 */
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if ( !person ) {
    return res.status(404).end()
  }

  res.json(person)
})

/**
 * create id for new person. id is between 0 and MAX_ID
 */
const MAX_ID = 10000
const getRandomId = () => {
  return Math.floor(Math.random() * Math.floor(MAX_ID))
}

/**
 * create and add new person
 */
app.post('/api/persons', (req, res) => {
  // check input validity
  if ( !req.body.name || !req.body.number) {
    return res.json({ error: 'name or number is missing' })
  }
  else if (persons.find(p => p.name === req.body.name)) {
    return res.json({ error: 'name must be unique' })
  }

  // create new id for person. create as long as unused if found
  let newId = 0  
  do {
    newId = getRandomId()    
  } while (persons.find(p => p.id === newId))  

  const newPerson = {
    id: newId,
    name: req.body.name,
    number: req.body.number
  }  

  persons = persons.concat(newPerson)
  
  res.json(newPerson)  
})

/**
 * delete person by id
 */
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  // check if person with given id exists
  if ( !persons.find(p => p.id === id) ) {
    return res.status(404).end()
  }

  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
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
