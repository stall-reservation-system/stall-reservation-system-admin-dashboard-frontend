import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import mock fetch handler (serves /api/*) — safe to keep in dev; it's lightweight.
import "./mocks/fetchMock";

createRoot(document.getElementById("root")!).render(<App />);
