import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CONFIGURATION DU CORS
  // Permet à ton frontend React (port 5173) de parler au backend (port 3000)
  app.enableCors({
    origin: 'http://localhost:5173', // L'URL de ton frontend React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. PRÉFIXE GLOBAL
  // Toutes tes routes commenceront par /api (ex: /api/properties)
  app.setGlobalPrefix('api');

  // 3. VALIDATION GLOBALE
  // Active la vérification automatique des données envoyées (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = 3000;
  await app.listen(port);
  console.log(`🚀 Serveur démarré sur : http://localhost:${port}/api`);
}
void bootstrap();
