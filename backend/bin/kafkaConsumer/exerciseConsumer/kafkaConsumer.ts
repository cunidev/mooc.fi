require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

import { Mutex } from "../../lib/await-semaphore"

import prismaClient from "../../lib/prisma"
import sentryLogger from "../../lib/logger"

import { handleMessage } from "../common/handleMessage"
import { Message } from "./interfaces"
import { MessageYupSchema } from "./validate"
import { saveToDatabase } from "./saveToDB"
import config from "../kafkaConfig"
import { createKafkaConsumer } from "../common/kafkaConsumer"
import { KafkaError } from "../../lib/errors"
import { LibrdKafkaError } from "node-rdkafka"

const TOPIC_NAME = [config.exercise_consumer.topic_name]

const mutex = new Mutex()
const prisma = prismaClient()

const logger = sentryLogger({ service: "kafka-consumer-exercise" })

const consumer = createKafkaConsumer(logger)

consumer.connect()

consumer.on("ready", () => {
  consumer.subscribe(TOPIC_NAME)
  const consumerImpl = async (error: LibrdKafkaError, messages: any) => {
    if (error) {
      logger.error(new KafkaError("Error while consuming", error))
      process.exit(-1)
    }
    if (messages.length > 0) {
      await handleMessage<Message>({
        kafkaMessage: messages[0],
        mutex,
        logger,
        consumer,
        prisma,
        MessageYupSchema,
        saveToDatabase,
      })
      setImmediate(() => {
        consumer.consume(1, consumerImpl)
      })
    } else {
      setTimeout(() => {
        consumer.consume(1, consumerImpl)
      }, 10)
    }
  }
  consumer.consume(1, consumerImpl)
})

consumer.on("event.error", (error) => {
  logger.error(new KafkaError("Error", error))
  throw error
})

consumer.on("event.log", function (log) {
  console.log(log)
})
