require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

app.use(bodyParser.json())
const cors = require('cors')

app.use(cors())

app.use(morgan('common'))

app.use(express.static('build'))

app.get('/api', (req, res) => {
  res.send('<h1>Hello World this is that damn API page!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<div>Phone book has information for ${Person.length} people<br><br>
    ${date}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person.toJSON())
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  console.log(req.body)

  const person = {
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatePerson => {
      res.json(updatePerson.toJSON())
    })
    .catch(error => next(error))
})

const generateID = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({ error: 'Name missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  console.log(person)

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
