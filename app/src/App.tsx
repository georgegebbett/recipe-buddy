import React, { useState } from "react";
// import "./App.css";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { NewUserForm } from "./components/NewUserForm";
import MenuAppBar from "./components/MenuAppBar";
import { BasicInfo } from "./components/BasicInfo";
import { Token } from "./types/types";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecipeDisplayPage } from "./pages/RecipeDisplayPage";
import { AddToGrocyPage } from "./pages/AddToGrocyPage";
import { SettingsPage } from "./pages/SettingsPage";

export const tokenAtom = atomWithStorage<Token>("recipe-token", {});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasicInfo tokenAtom={tokenAtom} />} />
        <Route
          path="/recipes"
          element={<RecipeDisplayPage tokenAtom={tokenAtom} />}
        />
        <Route
          path="/recipes/:id"
          element={<AddToGrocyPage tokenAtom={tokenAtom} />}
        />
        <Route
          path="/settings"
          element={<SettingsPage tokenAtom={tokenAtom} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
