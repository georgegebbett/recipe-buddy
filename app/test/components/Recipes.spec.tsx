import "@testing-library/jest-dom";
import { render, screen } from "../testUtils";
import { test, expect } from "vitest";
import { Recipes } from "../../src/components/Recipes";
import { tokenAtom } from "../../src/App";

test("simple render", () => {
  render(<Recipes recipes={[]} tokenAtom={tokenAtom} getRecipes={() => {}} />);

  expect(screen.getByText("Hello")).toBeInTheDocument();
});
