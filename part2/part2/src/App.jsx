import { useState } from 'react'
import Filter from './Filter'    
import PersonForm from './PersonForm'
import Persons from './Persons'
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
    <h2>Phonebook</h2>
    <Filter value={filter} onChange={handleFilterChange} />

    <h3>Add a new</h3>
    <PersonForm 
      onSubmit={addName} 
      newName={newName} 
      handleNameChange={handleNameChange} 
      newNumber={newNumber} 
      handleNumberChange={handleNumberChange}
    />

    <h3>Numbers</h3>
    <Persons persons={personsToShow} />
  </div>
)
}

export default App