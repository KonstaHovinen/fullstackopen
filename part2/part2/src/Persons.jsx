const Persons = ({ persons, toggleDelete }) => (
  <div>
    {persons.map(person => 
      <p key={person.name}>
        {person.name} {person.number} 
        <button onClick={() => toggleDelete(person.id)}>delete</button>
      </p>
    )}
  </div>
)

export default Persons