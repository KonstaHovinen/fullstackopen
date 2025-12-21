const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

let persons = []  // empty or initial data

app.listen(3001, () => console.log('Server running on port 3001'))

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) res.json(person)
  else res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})
