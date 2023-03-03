import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LocalDatabaseSeed } from './Modules/Database/Local.Database/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.get(LocalDatabaseSeed).sync();
  await app.listen(3000, '0.0.0.0');
  console.log(`Server is running on ${await app.getUrl()}`);
}
bootstrap();
