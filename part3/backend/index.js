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