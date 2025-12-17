import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addName = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return 
    }


    const nameObject = {
      name: newName,
      number: newNumber
    }
    

    setPersons(persons.concat(nameObject))
    

    setNewName('') 
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
  setFilter(event.target.value)
  }

  const personsToShow = filter === ''
  ? persons
  : persons.filter(person => 
      person.name.toLowerCase().includes(filter.toLowerCase())
    )

  return (
    <div>
      <h1>Phonebook</h1 >
      <div>
        Search: <input value={filter} onChange={handleFilterChange}/>
      </div>

      <h2>Add a new contact</h2>

      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      )}
      
    </div>
  )
}

export default App