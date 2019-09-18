import { gql } from "apollo-boost"

export const AllCoursesQuery = gql`
  query AllCourses($language: String) {
    courses(orderBy: order_ASC, language: $language) {
      id
      slug
      name
      order
      photo {
        id
        compressed
        uncompressed
      }
      promote
      status
      start_point
      study_module_start_point
      hidden
      description
      link
      study_modules {
        id
      }
    }
  }
`

export const AllEditorCoursesQuery = gql`
  query AllEditorCourses {
    courses(orderBy: order_ASC) {
      id
      name
      slug
      order
      status
      hidden
      photo {
        id
        compressed
        uncompressed
      }
    }
    currentUser {
      id
      administrator
    }
  }
`

export const CheckSlugQuery = gql`
  query checkSlug($slug: String) {
    course_exists(slug: $slug)
  }
`