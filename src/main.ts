import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  WinstonModule
} from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  });

  app.enableCors({
    origin: '*',
    methods: ['POST', 'GET']
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.listen(3003);
}
bootstrap();

// sdk.start();



// process.on('SIGTERM', () => {
//   sdk.shutdown()
//     .then(() => console.log('Tracing terminated'))
//     .catch((error) => console.log('Error terminating tracing', error))
//     .finally(() => process.exit(0));
// });