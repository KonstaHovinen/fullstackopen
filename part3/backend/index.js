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


app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }
  if (persons.find(p => p.name === name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const id = Math.max(0, ...persons.map(p => p.id)) + 1
  const person = { id, name, number }
  persons = persons.concat(person)
  res.json(person)
})

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const { name, number } = req.body
  const person = persons.find(p => p.id === id)
  if (!person) return res.status(404).end()

  const updatedPerson = { ...person, name, number }
  persons = persons.map(p => p.id !== id ? p : updatedPerson)
  res.json(updatedPerson)
})
