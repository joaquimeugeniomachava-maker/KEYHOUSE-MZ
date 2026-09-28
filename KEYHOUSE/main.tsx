import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// SEO: todas as rotas internas (#/…) apontam para o endereço principal do site,
// seja qual for o alojamento (GitHub Pages, Vercel, Cloudflare ou domínio próprio).
const canonical = document.createElement("link");
canonical.rel = "canonical";
canonical.href = `${window.location.origin}${window.location.pathname}`;
document.head.appendChild(canonical);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
