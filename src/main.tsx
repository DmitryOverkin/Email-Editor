import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Home } from "./pages/home/Home.tsx";
import { Provider } from "./Provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <Home />
    </Provider>
  </React.StrictMode>
);
