import { ForbiddenError } from "apollo-server-core"
import { Prisma, Course } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { stringArg } from "nexus/dist"

const addCourse = async (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addCourse", {
    type: "Course",
    args: {
      name: stringArg(),
      slug: stringArg(),
    },
    resolve: async (_, args, ctx) => {
      if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
      }
      const { name, slug } = args
      const prisma: Prisma = ctx.prisma
      const newCourse: Course = await prisma.createCourse({
        name: name,
        slug: slug,
      })
      return newCourse
    },
  })
}

const addCourseMutations = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  addCourse(t)
}

export default addCourseMutations