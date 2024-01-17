import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { Users } from './mode/entities/Users';
import { Profiles } from './mode/entities/Profiles';
import { Logs } from './mode/entities/Logs';
import { Roles } from './mode/entities/Roles';
import { LoggerModule } from 'nestjs-pino';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })], // this path .env can be override by envFilePath, if it has the same key
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().ip(),
        DB_PORT: Joi.number().default(3090),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        JWT_SECRET: Joi.string(),
        JWT_EXPIRATION_TIME: Joi.string(),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_SYNCHRONIZE: Joi.boolean().default(true),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<string>(ConfigEnum.DB_TYPE),
          host: config.get<string>(ConfigEnum.DB_HOST),
          port: config.get<number>(ConfigEnum.DB_PORT),
          username: config.get<string>(ConfigEnum.DB_USERNAME),
          password: config.get<string>(ConfigEnum.DB_PASSWORD),
          database: config.get<string>(ConfigEnum.DB_NAME),
          entities: [Users, Profiles, Logs, Roles],
          synchronize: config.get<boolean>(ConfigEnum.DB_SYNCHRONIZE),
          logging: ['error', 'warn'],
          // logging: false, // ['error'],
        } as TypeOrmModuleOptions;
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  level: 'info',
                  prettyPrint: {
                    colorize: true,
                    translateTime: true,
                  },
                },
              }
            : {
                target: 'pino-roll',
                options: {
                  level: 'info',
                  rollingInterval: 86400000,
                  logDirectory: 'logs',
                  filename: 'app-%DATE%.log',
                  dateFormat: 'YYYY-MM-DD',
                },
              },
      },
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [Logger], // Logger is a built-in provider
  exports: [Logger],
})
export class AppModule {}
