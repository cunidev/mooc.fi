/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

const range = require("lodash/range")
const fixtures = require("../../fixtures/users/search.json")

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

const createFakeResult = ({ count = 10, perPage = 10, start = 0 } = {}) => ({
  pageInfo: {
    startCursor: `${start}`,
    endCursor: `${Math.min(start + perPage, count)}`,
    hasNextPage: false, // not used in implementation?
    hasPreviousPage: false,
  },
  edges: range(start + 1, Math.min(start + perPage + 1, count + 1)).map(n => ({
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
  count,
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

    const testPaginationButtons = ({
      first = false,
      previous = false,
      next = false,
      last = false,
      click,
    }) => {
      const getButton = idx =>
        cy.get(`.search__StyledFooter-sc-1fzts8z-3 > :nth-child(${idx + 1})`)

      ;[first, previous, next, last].forEach((btn, idx) => {
        getButton(idx).should(`${btn ? "not." : ""}be.disabled`)
      })

      if (!click || typeof click !== "string") {
        return
      }

      const clicks = { first: 0, previous: 1, next: 2, last: 3 }
      getButton(clicks[click.trim().toLowerCase()]).click()

      cy.wait(100)
    }

    describe("works properly", () => {
      before(() => {
        cy.mockGraphQl([
          {
            query: "currentUser",
            result: adminUser,
          },
          {
            // initial first page (and ->1 with first button)
            query: "userDetailsContains",
            variables: {
              search: "a",
              first: 10,
            },
            result: createFakeResult({ count: 25 }),
          },
          {
            // 1->2 with next button
            query: "userDetailsContains",
            variables: {
              search: "a",
              first: 10,
              after: "10",
            },
            result: createFakeResult({ count: 25, start: 10 }),
          },
          {
            // 2->3 with next button
            query: "userDetailsContains",
            variables: {
              search: "a",
              first: 10,
              after: "20",
            },
            result: createFakeResult({ count: 25, start: 20 }),
          },
          {
            // 3->2 with back button
            query: "userDetailsContains",
            variables: {
              search: "a",
              last: 10,
              before: "20",
            },
            result: createFakeResult({ count: 25, start: 10 }),
          },
          {
            // 2->1 with back button
            query: "userDetailsContains",
            variables: {
              search: "a",
              last: 10,
              before: "10",
            },
            result: createFakeResult({ count: 25 }),
          },
          {
            // ->3 with last button
            query: "userDetailsContains",
            variables: {
              search: "a",
              last: 5,
            },
            result: createFakeResult({ count: 25, start: 20 }),
          },
          {
            // initial first page with 5 results
            query: "userDetailsContains",
            variables: {
              search: "b",
              first: 10,
            },
            result: createFakeResult({ count: 5 }),
          },
          {
            // initial first page with no results
            query: "userDetailsContains",
            variables: {
              search: "c",
              first: 10,
            },
            result: createFakeResult({ count: 0 }),
          },
          {
            // initial first page for 20 results per page
            query: "userDetailsContains",
            variables: {
              search: "a",
              first: 20,
            },
            result: createFakeResult({ count: 25, perPage: 20 }),
          },
          {
            query: "userDetailsContains",
            variables: {
              search: "a",
              first: 20,
              after: "20",
            },
            result: createFakeResult({ count: 25, perPage: 20, start: 20 }),
          },
        ])
      })

      after(() => {
        cy.resetMockGraphQl()
      })

      beforeEach(() => {
        cy.visit("/en/users/search")
        cy.get(".MuiSelect-root").select("10")
      })

      it("shows correctly with no results", () => {
        cy.get("input[name=search]").type("c")
        cy.getByTestId("search-button").click()

        cy.wait(100)

        cy.get(".MuiTableRow-root").should("have.length", 3) // header + rows + footer
      })

      it("shows correctly with only one page", () => {
        cy.get("input[name=search]").type("b")
        cy.getByTestId("search-button").click()

        cy.wait(100)

        cy.get(".MuiTableRow-root").should("have.length", 7) // header + rows + footer
        testPaginationButtons({}) // all should be disabled
      })

      it("shows correctly with multiple pages", () => {
        cy.get("input[name=search]").type("a")
        cy.getByTestId("search-button").click()
        cy.get(":nth-child(1) > .MuiTableCell-root > .MuiSkeleton-root").should(
          "be.visible",
        ) // skeleton should show

        cy.wait(100)

        cy.get(".MuiTableRow-root").should("have.length", 12) // header + rows + footer
        cy.get(
          ".MuiTableBody-root > :nth-child(1) > th.MuiTableCell-root",
        ).should("have.text", "fake1@email.com")
        cy.get(
          ".MuiTableBody-root > :nth-child(10) > th.MuiTableCell-root",
        ).should("have.text", "fake10@email.com")
      })

      it("has correct and functional pagination links", () => {
        cy.get("input[name=search]").type("a")
        cy.getByTestId("search-button").click()

        cy.wait(100)

        // go to page 3/3 with last page button
        testPaginationButtons({ next: true, last: true, click: "last" })

        cy.wait(100)

        cy.get(".MuiTableRow-root").should("have.length", 7) // header + rows + footer
        cy.get(
          ".MuiTableBody-root > :nth-child(1) > th.MuiTableCell-root",
        ).should("have.text", "fake21@email.com")
        cy.get(
          ".MuiTableBody-root > :nth-child(5) > th.MuiTableCell-root",
        ).should("have.text", "fake25@email.com")

        // go to page 2/3 with prev page button
        testPaginationButtons({
          first: true,
          previous: true,
          click: "previous",
        })

        cy.get(".MuiTableRow-root").should("have.length", 12) // header + rows + footer
        cy.get(
          ".MuiTableBody-root > :nth-child(1) > th.MuiTableCell-root",
        ).should("have.text", "fake11@email.com")
        cy.get(
          ".MuiTableBody-root > :nth-child(10) > th.MuiTableCell-root",
        ).should("have.text", "fake20@email.com")

        // go to page 1/3 with first page button
        testPaginationButtons({
          first: true,
          previous: true,
          next: true,
          last: true,
          click: "first",
        })

        cy.get(".MuiTableRow-root").should("have.length", 12) // header + rows + footer
        cy.get(
          ".MuiTableBody-root > :nth-child(1) > th.MuiTableCell-root",
        ).should("have.text", "fake1@email.com")
        cy.get(
          ".MuiTableBody-root > :nth-child(10) > th.MuiTableCell-root",
        ).should("have.text", "fake10@email.com")

        // go to page 2/3 with next page button
        testPaginationButtons({ next: true, last: true, click: "next" })

        cy.get(".MuiTableRow-root").should("have.length", 12) // header + rows + footer
        cy.get(
          ".MuiTableBody-root > :nth-child(1) > th.MuiTableCell-root",
        ).should("have.text", "fake11@email.com")
        cy.get(
          ".MuiTableBody-root > :nth-child(10) > th.MuiTableCell-root",
        ).should("have.text", "fake20@email.com")
      })

      it("rows per page can be changed", () => {
        cy.get("input[name=search]").type("a")
        cy.getByTestId("search-button").click()

        cy.wait(100)

        // 10 per page, first ten
        cy.get(".MuiTableRow-root").should("have.length", 12) // header + rows + footer
        cy.get(
          ".MuiTableBody-root > :nth-child(1) > th.MuiTableCell-root",
        ).should("have.text", "fake1@email.com")
        cy.get(
          ".MuiTableBody-root > :nth-child(10) > th.MuiTableCell-root",
        ).should("have.text", "fake10@email.com")

        cy.get(".MuiSelect-root").select("20")
        cy.wait(100)

        // 20 per page, first ten
        cy.get(".MuiTableRow-root").should("have.length", 22) // header + rows + footer
        cy.get(
          ".MuiTableBody-root > :nth-child(1) > th.MuiTableCell-root",
        ).should("have.text", "fake1@email.com")
        cy.get(
          ".MuiTableBody-root > :nth-child(20) > th.MuiTableCell-root",
        ).should("have.text", "fake20@email.com")

        // 1->2 with next button, 20 results per page
        testPaginationButtons({ next: true, last: true, click: "next" })

        // 20 per page, second and last page
        cy.get(".MuiTableRow-root").should("have.length", 7) // header + rows + footer
        cy.get(
          ".MuiTableBody-root > :nth-child(1) > th.MuiTableCell-root",
        ).should("have.text", "fake21@email.com")
        cy.get(
          ".MuiTableBody-root > :nth-child(5) > th.MuiTableCell-root",
        ).should("have.text", "fake25@email.com")

        cy.get(".MuiSelect-root").select("10")
        cy.wait(100)

        // switch back to 10 page, first ten
        cy.get(".MuiTableRow-root").should("have.length", 12) // header + rows + footer
        cy.get(
          ".MuiTableBody-root > :nth-child(1) > th.MuiTableCell-root",
        ).should("have.text", "fake1@email.com")
        cy.get(
          ".MuiTableBody-root > :nth-child(10) > th.MuiTableCell-root",
        ).should("have.text", "fake10@email.com")
      })
    })
  })

  describe("is not admin", () => {
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
  })
})
