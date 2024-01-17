import { Module } from '@nestjs/common';
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

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

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
          logging: true, // ['error'],
        } as TypeOrmModuleOptions;
      },
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
