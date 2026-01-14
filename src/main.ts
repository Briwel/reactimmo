import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // 1. Initialisation avec NestExpressApplication pour le support statique
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. CONFIGURATION DU CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Votre port React par défaut
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. PRÉFIXE GLOBAL (Toutes les routes d'API seront sous /api/...)
  app.setGlobalPrefix('api');

  // 4. SERVICE DES FICHIERS STATIQUES (Indispensable pour vos photos)
  // Les images seront accessibles via : http://localhost:3000/uploads/nom_image.jpg
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 5. VALIDATION GLOBALE (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = 3000;
  await app.listen(port);

  console.log(`\n🚀 Serveur démarré sur : http://localhost:${port}/api`);
  console.log(
    `🖼️  Dossier images servi sur : http://localhost:${port}/uploads/\n`,
  );
}

void bootstrap();
