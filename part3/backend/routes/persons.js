const personsRouter = require('express').Router()
const persons = require('../models/persons')

// GET all persons
personsRouter.get('/', (req, res) => {
  res.json(persons)
})

// GET one person
personsRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) res.json(person)
  else res.status(404).json({ error: 'not found' })
})

// POST new person
personsRouter.post('/', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ error: 'name or number missing' })
  if (persons.find(p => p.name === name)) return res.status(400).json({ error: 'name must be unique' })
  const id = Math.max(0, ...persons.map(p => p.id)) + 1
  const newPerson = { id, name, number }
  persons.push(newPerson)
  res.json(newPerson)
})

// PUT update person
personsRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  const { name, number } = req.body
  const person = persons.find(p => p.id === id)
  if (!person) return res.status(404).json({ error: 'not found' })
  const updatedPerson = { ...person, name, number }
  persons.splice(persons.indexOf(person), 1, updatedPerson)
  res.json(updatedPerson)
})

// DELETE person
personsRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  persons.splice(persons.findIndex(p => p.id === id), 1)
  res.status(204).end()
})

module.exports = personsRouter