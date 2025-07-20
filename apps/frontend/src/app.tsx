import reactLogo from '@/assets/react.svg';
import { treaty } from '@elysiajs/eden';
import viteLogo from '/vite.svg';
import { useEffect, useState } from 'react';

import type { App as BackendApp } from '../../backend/src/index';
import '@/App.css';

const app = treaty<BackendApp>('localhost:4000');

function App() {
  const [count, setCount] = useState(0);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGreeting() {
      try {
        const { data, error } = await app.api.greet({ name: 'Vite' }).get();
        if (error) {
          const errorMessage =
            typeof error === 'object' && error !== null
              ? (error as { error?: string }).error || JSON.stringify(error)
              : String(error);
          setError(errorMessage);
        } else {
          setGreeting(data.message);
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : 'Failed to fetch greeting';
        setError(errorMessage);
      }
    }
    fetchGreeting();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" rel="noopener" target="_blank">
          <img alt="Vite logo" className="logo" src={viteLogo} />
        </a>
        <a href="https://react.dev" rel="noopener" target="_blank">
          <img alt="React logo" className="logo react" src={reactLogo} />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>{error ? `Error: ${error}` : (greeting ?? 'Loading...')}</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} type="button">
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
  );
}

export default App;
