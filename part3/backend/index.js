const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('tiny'))

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' }
]

// GET all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// GET one person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) res.json(person)
  else res.status(404).json({ error: 'not found' })
})

// POST new person
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ error: 'name or number missing' })
  if (persons.find(p => p.name === name)) return res.status(400).json({ error: 'name must be unique' })
  const id = Math.max(0, ...persons.map(p => p.id)) + 1
  const newPerson = { id, name, number }
  persons.push(newPerson)
  res.json(newPerson)
})

// PUT update person
app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const { name, number } = req.body
  const person = persons.find(p => p.id === id)
  if (!person) return res.status(404).json({ error: 'not found' })
  const updatedPerson = { ...person, name, number }
  persons = persons.map(p => p.id !== id ? p : updatedPerson)
  res.json(updatedPerson)
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  const info = `<p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>`
  res.send(info)
})

// Unknown endpoint middleware (must be last!) //3.11 nothing-change so i can push it
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
})

const PORT = 3006
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
