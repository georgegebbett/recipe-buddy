import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import {
  index,
  integer,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core"

export const sqLiteTable = sqliteTableCreator((name) => `recipe-buddy_${name}`)

export const recipes = sqLiteTable("recipe", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }).notNull(),
  url: text("url", { length: 512 }).notNull(),
  steps: text("steps"),
  imageUrl: text("imageUrl", { length: 256 }),
})

export const recipeRelations = relations(recipes, ({ many }) => ({
  ingredients: many(ingredients),
}))

export type Recipe = InferSelectModel<typeof recipes>
export type InsertRecipe = InferInsertModel<typeof recipes>

export const ingredients = sqLiteTable("ingredient", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  scrapedName: text("scrapedName").notNull(),
  recipeId: integer("recipeId")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
})

export const ingredientRelations = relations(ingredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [ingredients.recipeId],
    references: [recipes.id],
  }),
}))

export type Ingredient = InferSelectModel<typeof ingredients>
export type InsertIngredient = InferInsertModel<typeof ingredients>

export const users = sqLiteTable(
  "user",
  {
    id: integer("id", { mode: "number" })
      .notNull()
      .primaryKey({ autoIncrement: true }),
    name: text("name", { length: 255 }).notNull(),
    username: text("username", { length: 255 }).notNull().unique(),
    passwordHash: text("passwordHash").notNull(),
  },
  (table) => {
    return {
      usernameIdx: index("username_idx").on(table.name),
    }
  }
)
