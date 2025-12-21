import { useState, useEffect } from 'react'
import Filter from './Filter'     
import PersonForm from './PersonForm'
import Persons from './Persons'
import personService from './services/persons' 
import Notification from './notification'  

// 2.19 needed 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()  // Ensure form submission doesn't reload

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
            setNotification({ message: `Updated ${response.data.name}`, type: 'success' })
            setNewName('')
            setNewNumber('')
            setTimeout(() => setNotification(null), 5000)
          })
          .catch(error => {
            setNotification({ message: `${newName} has already been removed from server`, type: 'error' })
            setTimeout(() => setNotification(null), 5000)
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
        // FIXED: use returnedPerson instead of response
        setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' })
        setNewName('')
        setNewNumber('')
        setTimeout(() => setNotification(null), 5000)
      })
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = filter === ''
    ? [...persons].sort((a, b) => a.name.localeCompare(b.name))
    : persons
        .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))
        
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (!person) return

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotification({ message: `Deleted ${person.name}`, type: 'success' })
          setTimeout(() => setNotification(null), 5000)
        })
        .catch(error => {
          setNotification({ message: `${person.name} has already been removed from server`, type: 'error' })
          setTimeout(() => setNotification(null), 5000)
        })
    }
  }

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
      <Persons persons={personsToShow} toggleDelete={deletePerson}/>
    </div>
  )
}

export default App
