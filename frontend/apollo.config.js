module.exports = {
  client: {
    tagName: "gql",
    includes: [
      "./components/**/*.tsx",
      "./pages/**/*.tsx",
      "./components/**/*.ts",
      "./pages/**/*.ts",
      "./graphql/**/*.ts",
      "./lib/**/*.tsx",
      "./lib/**/*.ts",
    ],
    excludes: ["node_modules"],
    service: {
      name: "backend",
      localSchemaFile: `schema.graphql`,
    },
  },
}
