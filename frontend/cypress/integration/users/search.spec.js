/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

const range = require("lodash/range")
const fixtures = require("../../fixtures/users/search.json")

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("user search", () => {
  const adminUser = {
    administrator: "true",
    email: "fake@email.com",
    first_name: "fake",
    last_name: "user",
    username: "fake-user",
  }

  const nonAdminUser = {
    email: "fake@email.com",
    first_name: "fake",
    last_name: "user",
    username: "fake-user",
  }

  describe("is admin", () => {
    before(() => {})

    beforeEach(() => {
      cy.signIn({
        accessToken: "fake",
        details: adminUser,
      })
      cy.mockTmc({ accessToken: "fake", details: { administrator: "true" } })
    })

    afterEach(() => cy.signOut())

    /*     it("shows search page", () => {
      cy.visit("/en/users/search")
      
      cy.getByText("User Search")
      cy.getByText("No results")
      cy.get('.MuiTableHead-root > .MuiTableRow-root > :nth-child(1)').should("exist")

      // FIXME: enable when responsive search page merged
/*       cy.viewport(480, 1024)

      cy.wait(1)

      cy.get('.MuiTableHead-root > .MuiTableRow-root > :nth-child(1)').should("exist") */
    //})

    it("search shows results", () => {
      cy.mockGraphQl([
        {
          query: "currentUser",
          result: adminUser,
        },
        {
          query: "userDetailsContains",
          variables: {
            search: "a",
            first: 10,
          },
          result: {
            pageInfo: {
              startCursor: "firstresult",
              endCursor: "10thresult",
              hasNextPage: false,
              hasPreviousPage: false,
            },
            edges: range(10).map(n => ({
              cursor: `${n}`,
              node: {
                id: n,
                email: `fake${n}@email.com`,
                student_number: `${123456 + n}`,
                upstream_id: `${123456 + n}`,
                first_name: "fake",
                last_name: `name${n}`,
              },
            })),
            count: 10,
          },
        },
      ])
      cy.visit("/en/users/search")

      cy.get("input[name=search]").type("a")
      cy.wait(1000)
      cy.getByTestId("search-button").click()

      cy.wait(5000)
    })
  })

  /*   describe("is not admin", () => {
    it("shows error", () => {
      cy.signIn({
        accessToken: "fake",
        details: nonAdminUser,
      })

      cy.mockTmc({ accessToken: "fake", details: { administrator: "false" } })
      cy.mockGraphQl({
        query: "currentUser",
        result: nonAdminUser,
      })

      cy.visit("/fi/users/search")

      cy.getByText("Sorry...")
    })
  }) */
})
