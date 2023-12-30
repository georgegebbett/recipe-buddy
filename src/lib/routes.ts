export const ROUTES = {
  recipes: {
    root: "/recipes",
    details: (id: number | string) => `/recipes/${id}`,
  },
  setup: "/setup"
}
