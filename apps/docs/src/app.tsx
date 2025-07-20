import { useState } from 'react';
import viteLogo from '/vite.svg';

import reactLogo from './assets/react.svg';

import './app.css';

function App() {
  const [count, setCount] = useState(0);

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
