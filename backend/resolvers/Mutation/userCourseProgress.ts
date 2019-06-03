import { Prisma } from "../../generated/prisma-client"
import { ForbiddenError } from "apollo-server-core"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, arg } from "nexus/dist"

const addUserCourseProgress = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addUserCourseProgress", {
    type: "UserCourseProgress",
    args: {
      user_id: idArg({ required: true }),
      course_id: idArg({ required: true }),
      progress: arg({ type: "ProgressArg", required: true }),
    },
    resolve: (_, args, ctx) => {
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
      const { user_id, course_id, progress } = args
      const prisma: Prisma = ctx.prisma
      return prisma.createUserCourseProgress({
        user: { connect: { id: user_id } },
        course: { connect: { id: course_id } },
        progress: progress,
      })
    },
  })
}

const addUserCourseProgressMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addUserCourseProgress(t)
}

export default addUserCourseProgressMutations