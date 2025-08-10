import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Mint from "./pages/Mint";
import Verify from "./pages/Verify";

import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/mint" style={{ marginRight: 12 }}>Mint</Link>
        <Link to="/verify">Verify</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Mint />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />); 