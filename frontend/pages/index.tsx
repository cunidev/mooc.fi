import React, { useEffect, useState } from "react"
import NextI18Next from "../i18n"
import ExplanationHero from "../components/Home/ExplanationHero"
import NaviCardList from "../components/Home/NaviCardList"
import CourseHighlights from "../components/Home/CourseHighlights"
import EmailSubscribe from "../components/Home/EmailSubscribe"
import {
  filterAndModifyCoursesByLanguage,
  filterAndModifyByLanguage,
  mapNextLanguageToLocaleCode,
} from "../util/moduleFunctions"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { AllModules as AllModulesData } from "../static/types/AllModules"
import { AllCourses as AllCoursesData } from "../static/types/AllCourses"
import { Courses } from "../courseData"
import { mockModules } from "../mockModuleData"
import CircularProgress from "@material-ui/core/CircularProgress"
const highlightsBanner = require("../static/images/courseHighlightsBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")
const allCoursesBanner = require("../static/images/AllCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")
const oldCoursesBanner = require("../static/images/oldCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")

const AllModulesQuery = gql`
  query AllModules {
    study_modules {
      id
      courses {
        id
        slug
        photo {
          id
          compressed
          uncompressed
        }
        promote
        status
        start_point
        hidden
        course_translations {
          id
          language
          name
          description
          link
        }
      }
      study_module_translations {
        id
        language
        name
        description
      }
    }
  }
`

const AllCoursesQuery = gql`
  query AllCourses {
    courses {
      id
      slug
      photo {
        id
        compressed
        uncompressed
      }
      promote
      status
      start_point
      hidden
      course_translations {
        id
        language
        name
        description
        link
      }
    }
  }
`
interface Image {
  id: any
  name: string | null
  original: string
  original_mimetype: string
  compressed: string
  compressed_mimetype: string
  uncompressed: string
  uncompressed_mimetype: string
  encoding: string | null
  default: boolean | null
}

type FilteredCourse = {
  name: string
  description: string
  id: string
  link: string
  photo: Image
  promote: boolean
  slug: string
  start_point: boolean
  hidden: boolean
  status: string
}

interface HomeProps {
  t: Function
  tReady: boolean
}

const Home = (props: HomeProps) => {
  const { t, tReady } = props
  // const { loading, error, data } = useQuery<AllModulesData>(AllModulesQuery)
  const { loading, error, data } = useQuery<AllCoursesData>(AllCoursesQuery)

  //save the default language of NextI18Next instance to state
  const [language, setLanguage] = useState(
    mapNextLanguageToLocaleCode(NextI18Next.config.defaultLanguage),
  )
  //every time the i18n language changes, update the state
  useEffect(() => {
    setLanguage(mapNextLanguageToLocaleCode(NextI18Next.i18n.language))
  }, [NextI18Next.i18n.language])
  //use the language from state to filter shown courses to only those which have translations
  //on the current language

  /*   const courses: [FilteredCourse] = filterAndModifyCoursesByLanguage(
    Courses.allcourses,
    language,
  ) */

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (loading || !tReady) {
    return <CircularProgress />
  }

  if (!data) {
    return <div>Error: no data?</div>
  }

  const courses: [FilteredCourse] = filterAndModifyCoursesByLanguage(
    data.courses,
    language,
  )

  console.log("courses?", data.courses, courses)
  return (
    <div>
      <ExplanationHero />
      <NaviCardList />
      <section id="courses-and-modules">
        <CourseHighlights
          courses={courses.filter(
            c => !c.hidden && c.promote === true && c.status === "Active",
          )}
          title={t("highlightTitle")}
          headerImage={highlightsBanner}
          subtitle={t("highlightSubtitle")}
        />

        <CourseHighlights
          courses={courses.filter(c => !c.hidden && c.status === "Active")}
          title={t("allCoursesTitle")}
          headerImage={allCoursesBanner}
          subtitle={""}
        />
        <CourseHighlights
          courses={courses.filter(c => !c.hidden && c.status === "Upcoming")}
          title={t("upcomingCoursesTitle")}
          headerImage={allCoursesBanner}
          subtitle={""}
        />
        <CourseHighlights
          courses={courses.filter(c => !c.hidden && c.status === "Ended")}
          title={t("endedCoursesTitle")}
          headerImage={oldCoursesBanner}
          subtitle={""}
        />
      </section>
      <EmailSubscribe />
    </div>
  )
}

Home.getInitialProps = function() {
  return {
    namespacesRequired: ["home", "navi"],
  }
}

export default NextI18Next.withTranslation("home")(Home)

/*<ModuleNavi modules={modules} />
      {modules.map(module => (
        <Modules key={module.id} module={module} />
      ))}*/
