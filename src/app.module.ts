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

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: joiValidationSchema,
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        stores: [
          createKeyv(
            `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
          ),
        ],
      }),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      database: process.env.DB_NAME,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 120,
          limit: 100,
        },
      ],
    }),

    CommonModule,

    AuthModule,
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
