import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
