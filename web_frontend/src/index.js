import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { SubmitContextProvider } from "./components/context/submitStoredContext";
import { SearchContextProvider } from "./components/context/searchStoredContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <SearchContextProvider>
        <SubmitContextProvider>
            <App />
        </SubmitContextProvider>
    </SearchContextProvider>
);
