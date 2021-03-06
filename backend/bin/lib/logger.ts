import WinstonSentry from "winston-sentry-log"
import winston from "winston"
import { Sentry } from "../../services/sentry"

interface LoggerOptions {
  service: string
}

export default function logger({ service }: LoggerOptions) {
  const transports: winston.transport[] = [new winston.transports.Console()]

  if (process.env.NODE_ENV === "production") {
    transports.push(
      new WinstonSentry({
        tags: {
          service,
        },
        level: "error",
        sentryClient: Sentry,
        isClientInitialized: true,
        fingerprint: service,
      }),
    )
  }

  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: { service },
    transports,
  })
}
