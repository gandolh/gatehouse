import cards from "virtual:gatehouse-cards";
import { createRoot, hydrateRoot } from "react-dom/client";
import { page } from "./page";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) throw new Error("index.html has no #root");

// The build renders the page into index.html, so the browser hydrates that markup. The dev server prerenders nothing,
// so there the page mounts afresh.
if (import.meta.env.DEV) createRoot(root).render(page(cards));
else hydrateRoot(root, page(cards));
