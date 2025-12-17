const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)
  
  return(
    <p><b>total of {total} exercises</b></p>
  )
}

const Header = ({ course }) => <h1>{course.name}</h1>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => {
  return (
    <div>
        {parts.map(part =>
          <Part key={part.id} part={part}/>
        )}
    </div>
  )
}

export default Course