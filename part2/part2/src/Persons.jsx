const Persons = ({ persons, toggleDelete }) => (
  <ul>
    {(Array.isArray(persons) ? persons : []).map(p => (
      <li key={p.id}>
        {p.name} {p.number} 
        <button onClick={() => toggleDelete(p.id)}>delete</button>
      </li>
    ))}
  </ul>
)

export default Persons
