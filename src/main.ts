import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as compression from 'compression'
import { NextFunction, Request, Response } from 'express'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import * as swaggerUi from 'swagger-ui-express'

import {
  description as pkgDesc,
  name as pkgName,
  version as pkgVersion,
} from '../package.json'
import { SeimBadRequestException } from './common/exception'
import { ShutdownObserver } from './common/observers'
import { MainModule } from './main.module'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      TCP_PORT: string
      REDIS_PORT: string
      PACKAGE_NAME: string
      PACKAGE_VERSION: string
      MACHINE_ID: string
      BASE_SERVER_URL: string
      S3_BUCKET: string
      S3_ACCESS_KEY_ID: string
      S3_SECRET_ACCESS_KEY: string
      INVITATION_EXPIRE_TIME_IN_DAY: string
    }
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(MainModule)

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  app.use(compression())

  const options = new DocumentBuilder()
    .setTitle(pkgName)
    .setDescription(pkgDesc)
    .setVersion(pkgVersion)
    .addTag(pkgName, pkgDesc)
    // .addServer(process.env.BASE_SERVER_URL)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build()

  const document = SwaggerModule.createDocument(app, options)
  const forwardedPrefixSwagger = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // req.originalUrl = (req.headers['x-forwarded-prefix'] || '') + req.url;
    next()
  }

  app.use(
    '/apidoc/',
    forwardedPrefixSwagger,
    swaggerUi.serve,
    swaggerUi.setup(document),
  )
  app.use(
    '/apidoc-json/',
    forwardedPrefixSwagger,
    (req: Request, res: Response) => {
      return res.send(document)
    },
  )

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (
        errors: ValidationError[],
      ): SeimBadRequestException => {
        return SeimBadRequestException.fromValidationErrors(errors)
      },
    }),
  )

  app.get(ShutdownObserver).setupGracefulShutdown(app)

  await app.listen(parseInt(process.env.PORT, 10) || 3002)
  console.log(`Application is running on: ${await app.getUrl()}`)
  app
    .get(WINSTON_MODULE_NEST_PROVIDER)
    .log(`Application is running on: ${await app.getUrl()}`)
  app
    .get(WINSTON_MODULE_NEST_PROVIDER)
    .log(`Swagger is running on: ${await app.getUrl()}/apidoc`)
}

bootstrap()
