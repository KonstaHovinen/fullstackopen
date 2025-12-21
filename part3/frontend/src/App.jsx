import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  // State
  const [persons, setPersons] = useState([]) // ensure array
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  // Fetch all persons from backend
  useEffect(() => {
    personsService.getAll()
      .then(response => setPersons(response.data))
      .catch(error => {
        console.error(error)
        setNotification({ message: 'Failed to fetch persons', type: 'error' })
        setTimeout(() => setNotification(null), 5000)
      })
  }, [])

  // Add or update person
  const addName = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      if (window.confirm(`${newName} is already added. Replace number?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personsService.update(existingPerson.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data))
            setNotification({ message: `Updated ${response.data.name}`, type: 'success' })
            setNewName('')
            setNewNumber('')
            setTimeout(() => setNotification(null), 5000)
          })
          .catch(error => {
            console.error(error)
            setNotification({ message: `Failed to update ${existingPerson.name}`, type: 'error' })
            setTimeout(() => setNotification(null), 5000)
          })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber }
    personsService.create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNotification({ message: `Added ${response.data.name}`, type: 'success' })
        setNewName('')
        setNewNumber('')
        setTimeout(() => setNotification(null), 5000)
      })
      .catch(error => {
        console.error(error)
        setNotification({ message: 'Failed to add person', type: 'error' })
        setTimeout(() => setNotification(null), 5000)
      })
  }

  // Delete person
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (!person) return

    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotification({ message: `Deleted ${person.name}`, type: 'success' })
          setTimeout(() => setNotification(null), 5000)
        })
        .catch(error => {
          console.error(error)
          setNotification({ message: `Failed to delete ${person.name}`, type: 'error' })
          setTimeout(() => setNotification(null), 5000)
        })
    }
  }

  // Handlers
  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)

  // Filtered persons
  const personsToShow = (Array.isArray(persons) ? persons : []).filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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
      <Persons persons={personsToShow} toggleDelete={deletePerson} />
    </div>
  )
}

export default App
