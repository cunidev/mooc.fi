/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

const fixtures = require("../fixtures/home/data.json")

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

const viewports = [
  "macbook-15", // 1440x900
  "macbook-13", // 1280x800
  "macbook-11", // 1366x768
  "ipad-2", // 768x1024
  // "ipad-mini",   // 768x1024
  "iphone-6+", // 414x736
  "iphone-6", // 375x667
  "iphone-5", // 320x568
  // "iphone-4",    // 320x480
  "iphone-3", // 320x480
]

describe("front page", () => {
  it("/ loads and shows Finnish as default", () => {
    cy.visit("/")

    cy.get("h1").contains(
      "Laadukkaita, avoimia ja ilmaisia verkkokursseja kaikille",
    )
  })

  it("/en loads and shows English", () => {
    cy.visit("/en")

    cy.get("h1").contains("High-quality, open, and free courses for everyone!")
  })

  describe("snapshots", () => {
    before(() => {
      Object.keys(fixtures).forEach(language =>
        cy.mockGraphQl([
          {
            query: "study_modules",
            result: fixtures[language].study_modules,
            variables: { language },
          },
          {
            query: "courses",
            result: fixtures[language].courses,
            variables: { language },
          },
        ]),
      )
    })
    ;[["/", "fi_FI"], ["/en", "en_US"]].forEach(([route, language]) => {
      viewports.forEach(vp => {
        describe(`viewport ${vp}`, () => {
          it(`route ${route} should match snapshot`, () => {
            cy.viewport(vp)
            cy.visit(route).matchImageSnapshot(`home-${language}-${vp}`)
          })
        })
      })
    })
  })

  describe("language switcher", () => {
    it("/ shows English and switches languages", () => {
      cy.visit("/")

      cy.getByTestId("language-switch").contains("English")
      cy.getByTestId("language-switch").click()

      cy.getByTestId("language-switch").contains("Suomi")
      cy.url().should("include", "/en/")
      cy.get("h1").contains(
        "High-quality, open, and free courses for everyone!",
      )
    })

    it("/en/ shows Suomi and switches languages", () => {
      cy.visit("/en/")

      cy.getByTestId("language-switch").contains("Suomi")
      cy.getByTestId("language-switch").click()

      cy.getByTestId("language-switch").contains("English")
      cy.url().should("not.include", "/en/")
      cy.url().should("not.include", "/fi/")
      cy.get("h1").contains(
        "Laadukkaita, avoimia ja ilmaisia verkkokursseja kaikille",
      )
    })
  })
})
