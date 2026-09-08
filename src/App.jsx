import { useEffect, useState } from 'react'

function App() {
  const [students, setStudents] = useState({})
  const [name, setName] = useState('')
  const [error, setError] = useState(null)

  const loadStudents = () => {
    fetch('/api/students')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setStudents(data)
        setError(null)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const addStudent = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setName('')
    loadStudents()
  }

  const deleteStudent = async (id) => {
    await fetch(`/api/students/${id}`, { method: 'DELETE' })
    loadStudents()
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Student App for management 121    </h1>
        <p className="text-sm text-slate-500 mb-4">Frontend (Vite + Tailwind) → Backend (Spring Boot)</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            Error calling /api/students: {error}
          </div>
        )}

        <form onSubmit={addStudent} className="flex gap-2 mb-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New student name"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            Add
          </button>
        </form>

        <ul className="space-y-2">
          {Object.entries(students).map(([id, studentName]) => (
            <li
              key={id}
              className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2"
            >
              <span className="text-slate-700">{studentName}</span>
              <button
                onClick={() => deleteStudent(id)}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {Object.keys(students).length === 0 && !error && (
          <p className="text-sm text-slate-400 text-center mt-4">No students yet.</p>
        )}
      </div>
    </div>
  )
}

export default App
