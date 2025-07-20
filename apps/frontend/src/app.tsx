import { treaty } from '@elysiajs/eden';
import { useEffect, useState } from 'react';
import reactLogo from '@/assets/react.svg';
import viteLogo from '/vite.svg';

import type { App as BackendApp } from '../../backend/src/index';
import '@app.css';

const app = treaty<BackendApp>('localhost:4000');

function App() {
  const [count, setCount] = useState(0);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGreeting() {
      try {
        const { data, error: apiError } = await app.api
          .greet({ name: 'Vite' })
          .get();
        if (apiError) {
          const errorMessage =
            typeof apiError === 'object' && apiError !== null
              ? (apiError as { error?: string }).error ||
                JSON.stringify(apiError)
              : String(apiError);
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
          <picture>
            <img alt="Vite logo" className="logo" src={viteLogo} />
          </picture>
        </a>
        <a href="https://react.dev" rel="noopener" target="_blank">
          <picture>
            <img alt="React logo" className="logo react" src={reactLogo} />
          </picture>
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>{error ? `Error: ${error}` : (greeting ?? 'Loading...')}</h2>
      <div className="card">
        <button
          onClick={() => setCount((prevCount) => prevCount + 1)}
          type="button"
        >
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
