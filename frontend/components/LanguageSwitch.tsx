import React from "react"
import Language from "@material-ui/icons/Language"
import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"
import Link from "next/link"

const SwitchLink = styled.a`
  font-size: 14px;
  line-height: 1.3;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  text-decoration: none;
  color: black;
  &:visited {
    color: black;
  }
  &:focus {
    color: black;
  }
`

const LanguageSwitch = () => {
  return (
    <LanguageContext.Consumer>
      {({ language, url, hrefUrl }) => {
        return (
          <Link as={url} href={hrefUrl}>
            <SwitchLink href={url}>
              <Language style={{ marginRight: "0.4rem" }} />
              <p style={{ marginTop: "0.2rem" }}>
                {language === "en" ? "Suomi" : "English"}
              </p>
            </SwitchLink>
          </Link>
        )
      }}
    </LanguageContext.Consumer>
  )
}

export default LanguageSwitch
