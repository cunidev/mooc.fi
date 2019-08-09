import React from "react"
import NextI18Next from "../../../i18n"
import { isSignedIn, isAdmin } from "../../../lib/authentication"
import { NextPageContext as NextContext } from "next"
import redirect from "../../../lib/redirect"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import {
  ShowUserUserOverView as UserOverViewData,
  ShowUserUserOverView_user_completions,
} from "../../../static/types/generated/ShowUserUserOverView"
/* import styled from "styled-components"
import Typography from "@material-ui/core/Typography" */
import Container from "../../../components/Container"
import Completions from "../../../components/Completions"
import { SingletonRouter, withRouter } from "next/router"
import AdminError from "../../../components/Dashboard/AdminError"

export const UserOverViewQuery = gql`
  query ShowUserUserOverView($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      id
      upstream_id
      first_name
      last_name
      email
      ...UserCompletions
    }
  }
  ${Completions.fragments.completions}
`
/* const Title = styled(Typography)`
  font-family: "Open Sans Condensed", sans-serif !important;
  margin-top: 7rem;
  margin-left: 2rem;
  margin-bottom: 1rem;
  @media (min-width: 320px) {
    font-size: 46px;
  }
  @media (min-width: 600px) {
    font-size: 56px;
  }
  @media (min-width: 960px) {
    font-size: 72px;
  }
` */

interface CompletionsProps {
  namespacesRequired: string[]
  router: SingletonRouter
  t: Function
  i18n: any
  tReady: boolean
  admin: boolean
}

function CompletionsPage(props: CompletionsProps) {
  const { router } = props

  if (!props.admin) {
    return <AdminError />
  }
  const { loading, error, data } = useQuery<UserOverViewData>(
    UserOverViewQuery,
    { variables: { upstream_id: Number(router.query.id) } },
  )
  let completions: ShowUserUserOverView_user_completions[] = []

  if (error) {
    return (
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    )
  }

  if (loading || !data) {
    return <div>Loading</div>
  }

  if (data.user && data.user.completions) {
    completions = data.user.completions
  }
  return (
    <Container>
      <div>
        <Completions completions={completions} />
      </div>
    </Container>
  )
}

CompletionsPage.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
    namespacesRequired: ["common"],
  }
}

export default withRouter(
  NextI18Next.withTranslation("profile")(CompletionsPage),
)