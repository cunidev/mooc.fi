import { Message } from "../userPointsConsumer/interfaces"
import { Logger } from "winston"
import { Message as KafkaMessage } from "node-rdkafka"
import { KafkaMessageError, ValidationError } from "/bin/lib/errors"
import { MessageYupSchema } from "../userPointsConsumer/validate"
import { groupBy, uniq, compact, difference } from "lodash"
import Knex from "knex"
import { getBatchUsersFromTMC } from "../common/getUserFromTMC"

const handleMessages = async (messages: KafkaMessage[], logger: Logger) => {
  logger.info(`Handling ${messages.length} messages.`)
  const validMessages = compact(
    await Promise.all(
      messages.map(async (kafkaMessage) => {
        const message = kafkaMessageToMessage(kafkaMessage, logger)
        if (!message) {
          return null
        }

        try {
          await MessageYupSchema.validate(message)
        } catch (error) {
          logger.error(
            new ValidationError("JSON validation failed", message, error),
          )
          return null
        }

        return message
      }),
    ),
  )
  logger.info(`Validated messages, ${validMessages.length} were valid.`)

  const userIds = compact(uniq(validMessages.map((o) => o?.user_id)))
  logger.info(
    `Messages contain ${userIds} unique users. Making sure they exist...`,
  )
  const usersInDb: { upstream_id: number }[] = await Knex("user")
    .select("upstream_id")
    .whereIn("upstream_id", userIds)
  const newUsers = difference(
    userIds,
    usersInDb.map((o) => o.upstream_id),
  )
  logger.info(`New users that need to be imported: ${newUsers.length}`)
  const users = await getBatchUsersFromTMC(newUsers)
  logger.info(`Import done. ${users.length} imported.`)
}

const kafkaMessageToMessage = (
  kafkaMessage: KafkaMessage,
  logger: Logger,
): Message | null => {
  let message: Message
  try {
    message = JSON.parse(kafkaMessage?.value?.toString("utf8") ?? "")
  } catch (error) {
    logger.error(new KafkaMessageError("invalid message", kafkaMessage, error))
    return null
  }
  return message
}

export default handleMessages
