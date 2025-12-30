import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Préfixe global (Important : à définir AVANT les routes)
  app.setGlobalPrefix('api');

  // 2. Configuration du CORS sécurisée
  // On remplace le '*' par les URLs spécifiques de tes environnements de dev
  app.enableCors({
    origin: [
      'http://localhost:3000', // Port par défaut NestJS (si besoin)
      'http://localhost:5173', // Port par défaut de Vite (React)
      process.env.FRONTEND_URL, // URL de production via variable d'environnement
    ].filter(Boolean), // Supprime les valeurs undefined si FRONTEND_URL n'est pas rempli
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Validation globale avec class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Nettoie les données reçues des champs inconnus
      forbidNonWhitelisted: true, // Bloque la requête si un champ inconnu est envoyé
      transform: true, // Convertit les types (ex: string en number si besoin)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 4. Lancement du serveur
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`---`);
  console.log(`🚀 Serveur démarré sur : http://localhost:${port}/api`);
  console.log(
    `🔒 Sécurité : CORS activé, Rate Limiting prêt, Validation active`,
  );
  console.log(`---`);
}

void bootstrap();
