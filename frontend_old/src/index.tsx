import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context/AppContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* ✅ Provide context for the whole app */}
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
