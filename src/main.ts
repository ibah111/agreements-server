import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LocalDatabaseSeed } from './Modules/Database/Local.Database/seed';
import client from './utils/client';
import { getSwaggerOptions, getSwaggerOptionsCustom } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { excludeExtraneousValues: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Agreements')
    .setDescription('AgrementsApp NBK')
    .setVersion('1.0')
    .addBasicAuth({ name: 'token', in: 'header', type: 'apiKey' })
    .build();

  await app.get(LocalDatabaseSeed).sync();
  const document = SwaggerModule.createDocument(
    app,
    config,
    getSwaggerOptions(),
  );
  SwaggerModule.setup('docs', app, document, getSwaggerOptionsCustom());
  await app.get(LocalDatabaseSeed).sync();
  await app.listen(client('port'), '0.0.0.0');
  console.log(`Server is running on ${await app.getUrl()}/docs`);
}
bootstrap();
