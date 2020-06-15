// import { prismaObjectType } from "nexus-prisma"
import { schema } from "nexus"

schema.objectType({
  name: "course",
  definition(t) {
    t.model.id()
    t.model.automatic_completions()
    t.model.completion_email({ alias: "completion_email_id" })
    t.model.email_template({ alias: "completion_email" })
    t.model.completions_handled_by({ alias: "completions_handled_by_id" })
    t.model.course_courseTocourse_completions_handled_by({
      alias: "completions_handled_by",
    })
    t.model.created_at()
    t.model.ects()
    t.model.end_date()
    t.model.exercise_completions_needed()
    t.model.has_certificate()
    t.model.hidden()
    t.model.inherit_settings_from({ alias: "inherit_settings_from_id" })
    t.model.course_courseTocourse_inherit_settings_from({
      alias: "inherit_settings_from",
    })
    t.model.name()
    t.model.order()
    t.model.owner_organization({ alias: "owner_organization_id" })
    t.model.organization({ alias: "owner_organization" })
    t.model.photo({ alias: "photo_id" })
    t.model.image({ alias: "photo" })
    t.model.points_needed()
    t.model.promote()
    t.model.slug()
    t.model.start_date()
    t.model.start_point()
    t.model.status()
    t.model.study_module_order()
    t.model.study_module_start_point()
    t.model.support_email()
    t.model.teacher_in_charge_email()
    t.model.teacher_in_charge_name()
    t.model.updated_at()
    t.model.completion()
    t.model.completion_registered()
    t.model.course_alias()
    t.model.course_organization()
    t.model.course_variant()
    t.model.exercise()
    t.model.open_university_registration_link()
    t.model.user_course_progress()
    t.model.user_course_service_progress()
    t.model.UserCourseSettings()
    t.model.user_course_settings_visibility()
    t.model.service()
    t.model.study_module()
    t.string("description")
    t.string("link")
    /*t.prismaFields(["*"])
    t.field("description", { type: "String" })
    t.field("link", { type: "String" })*/
  },
})