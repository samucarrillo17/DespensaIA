import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { joiValidationSchema } from './config/joi.validation';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { IngredientesModule } from './ingredientes/ingredientes.module';
import { RecetasModule } from './recetas/recetas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AiModule } from './ai/ai.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: joiValidationSchema,
    }),

    

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      database: process.env.DB_NAME,
      synchronize: true,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 120000,
          limit: 100,
        },
      ],
    }),

    CommonModule,

    AuthModule,

    IngredientesModule,

    RecetasModule,

    UsuariosModule,

    AiModule,

    CalificacionesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
