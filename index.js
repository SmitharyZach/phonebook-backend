const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())


app.use(bodyParser.json())

app.use(morgan('common'))


let persons = [
    {
      "name": "Zach Smith",
      "number": "919-745-9382",
      "id": 1
    },
    {
      "name": "Becca Smith",
      "number": "919-623-7229",
      "id": 2
    },
    {
      "name": "Wayne Smith",
      "number": "919-740-8846",
      "id": 3
    },
    {
      "name": "Turd head",
      "number": "919",
      "id": 4
    }
  ]

app.get('/api', (req, res) => {
  res.send('<h1>Hello World this is that damn API page!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()

  res.send(`<div>Phone book has information for ${persons.length} people<br><br>
    ${date}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log('id', id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const generateID = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(404).json({
      error: 'Both name and number are required'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateID(500)
  }

  persons = persons.concat(person)

  res.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
