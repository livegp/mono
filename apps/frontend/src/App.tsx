import { useState, useEffect } from 'react'
import { treaty } from '@elysiajs/eden'

import type { App } from '../../backend/src/index'
import reactLogo from '@/assets/react.svg'
import viteLogo from '/vite.svg'
import '@/App.css'

const app = treaty<App>(`localhost:4000`)

function App() {
  const [count, setCount] = useState(0)
  const [greeting, setGreeting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGreeting() {
      try {
        const { data, error } = await app.api.greet({ name: 'Vite' }).get()
        if (error) {
          const errorMessage = typeof error === 'object' && error !== null
            ? (error as any).error || JSON.stringify(error)
            : String(error);
          setError(errorMessage)
        } else {
          setGreeting(data.message)
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to fetch greeting'
        setError(errorMessage)
      }
    }
    fetchGreeting()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>{error ? `Error: ${error}` : greeting ?? 'Loading...'}</h2>
      <div className="card">
        <button type='button' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
