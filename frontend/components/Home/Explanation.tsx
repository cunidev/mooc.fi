import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Button, Typography } from "@material-ui/core"
import NextI18Next from "../../i18n"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "70%",
      zIndex: 50,
      marginLeft: "1em",
      marginBottom: "1rem",
      overflow: "hidden",
    },
    title: {
      [theme.breakpoints.down("xs")]: {
        fontSize: 72,
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: 144,
      },
      fontFamily: "Open Sans Condensed Light, sans-serif",
      paddingTop: "2rem",
      paddingBottom: "2rem",
    },
    subtitle: {
      [theme.breakpoints.up("xs")]: {
        fontSize: 18,
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: 22,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 32,
      },
      fontFamily: "Open Sans Condensed Light, sans-serif",
      paddingRight: "1rem",
      paddingBottom: "2rem",
    },
    button: {
      margin: "auto",
      backgroundColor: "#00A68D",
      color: "white",
      fontSize: 24,
      fontFamily: "Open Sans Condensed Light, sans-serif",
      marginLeft: "10%",
    },
  }),
)

function Explanation() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography variant="h1" component="h1" className={classes.title}>
        MOOC.fi
      </Typography>
      <div>
        <Typography
          variant="subtitle1"
          component="p"
          className={classes.subtitle}
        >
          <NextI18Next.Trans i18nKey="intro" />
        </Typography>
        <Button variant="contained" className={classes.button}>
          <NextI18Next.Trans i18nKey="courseButton" />
        </Button>
      </div>
    </div>
  )
}
export default Explanation
