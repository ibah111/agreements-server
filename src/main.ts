import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LocalDatabaseSeed } from './Modules/Database/Local.Database/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Agrements')
    .setDescription('AgrementsApp NBK')
    .setVersion('1.3.3.7')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.get(LocalDatabaseSeed).sync();
  const webDoc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, webDoc);

  await app.get(LocalDatabaseSeed).sync();
  await app.listen(3000, '0.0.0.0');
  console.log(`Server is running on ${await app.getUrl()}/docs`);
}
bootstrap();
