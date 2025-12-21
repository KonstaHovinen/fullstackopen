import { useState, useEffect } from 'react'
import Filter from './Filter'     
import PersonForm from './PersonForm'
import Persons from './Persons'
import personService from './services/persons' 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    const existingPerson = persons.find(
    p => p.name.toLowerCase() === newName.toLowerCase()
  )


    if (existingPerson) {
    if (window.confirm(
    `${newName} is already added to phonebook, replace the old number with a new one?`
    )) {
    const updatedPerson = { ...existingPerson, number: newNumber }

    personService
      .update(existingPerson.id, updatedPerson)
      .then(response => {
        setPersons(
          persons.map(p =>
            p.id !== existingPerson.id ? p : response.data
          )
        )
        setNewName('')
        setNewNumber('')
      })
    }
    return
}
    const nameObject = {
      name: newName,
      number: newNumber
    }
    
 
    personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
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


  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

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
      <Persons persons={personsToShow}
      toggleDelete={deletePerson}/>
    </div>
  )
}

export default App