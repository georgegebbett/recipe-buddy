import React from "react";
import { atomWithStorage } from "jotai/utils";
import { Token } from "./types/types";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecipeDisplayPage } from "./pages/RecipeDisplayPage";
import { AddToGrocyPage } from "./pages/AddToGrocyPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SetupPage } from "./pages/SetupPage";
import { LoginPage } from "./pages/LoginPage";

export const tokenAtom = atomWithStorage<Token>("recipe-token", {});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recipes" element={<RecipeDisplayPage />} />
        <Route path="/recipes/:id" element={<AddToGrocyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/setup" element={<SetupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
