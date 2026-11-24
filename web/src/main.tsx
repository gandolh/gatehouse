import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) throw new Error("index.html has no #root");
const page = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The build renders the page into index.html, so the browser hydrates that markup. The dev server prerenders nothing,
// so there the page mounts afresh.
if (import.meta.env.DEV) createRoot(root).render(page);
else hydrateRoot(root, page);
