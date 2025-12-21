const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('tiny'))

const persons = require('./models/persons')
const personsRouter = require('./routes/persons')
app.use('/api/persons', personsRouter)


app.get('/info', (req, res) => {
  const info = `<p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>`
  res.send(info)
})

// Unknown endpoint middleware (must be last!) //3.11 nothing-change so i can push it
app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
})

const PORT = process.env.PORT || 3006
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
