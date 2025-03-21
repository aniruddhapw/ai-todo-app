import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/todos')
      setTodos(response.data)
    } catch (err) {
      setError('Failed to fetch todos')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/api/todos', {
        todo: input
      })
      setTodos([...todos, response.data])
      setInput('')
    } catch (err) {
      setError('Failed to add todo')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err) {
      setError('Failed to delete todo')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">AI Todo List</h1>
                
                <form onSubmit={handleSubmit} className="mb-8">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter your todo..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-800">{todo.todo}</span>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
