import { useCallback, useEffect, useState } from "react";
import ogPreviewAvif from "@/assets/branding/og-image.png?w=600&format=avif&quality=70";
import ogPreview from "@/assets/branding/og-image.png?w=600&format=png&quality=80";
import ogPreviewWebp from "@/assets/branding/og-image.png?w=600&format=webp&quality=75";
import { Icon } from "@/components/icon";
import { api } from "@/lib/eden";
import "./app.css";

function App() {
  const [count, setCount] = useState(0);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const incrementCount = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  useEffect(() => {
    async function fetchGreeting() {
      try {
        const { data, error: apiError } = await api.api
          .greet({ name: "Vite" })
          .get();
        if (apiError) {
          const errorMessage =
            typeof apiError === "object" && apiError !== null
              ? (apiError as { error?: string }).error ||
                JSON.stringify(apiError)
              : String(apiError);
          setError(errorMessage);
        } else {
          setGreeting(data.message);
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "Failed to fetch greeting";
        setError(errorMessage);
      }
    }
    fetchGreeting();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" rel="noopener" target="_blank">
          <Icon className="logo" name="vite" title="Vite logo" />
        </a>
        <a href="https://react.dev" rel="noopener" target="_blank">
          <Icon className="logo react" name="react" title="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>{error ? `Error: ${error}` : (greeting ?? "Loading...")}</h2>
      <div className="card">
        <button onClick={incrementCount} type="button">
          count is {count}
        </button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <picture className="og-preview">
        <source srcSet={ogPreviewAvif} type="image/avif" />
        <source srcSet={ogPreviewWebp} type="image/webp" />
        <img
          alt="Mono starter monorepo"
          height={315}
          loading="lazy"
          src={ogPreview}
          width={600}
        />
      </picture>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
