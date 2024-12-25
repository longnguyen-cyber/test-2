import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as firebase from 'firebase-admin';
import { HealthTopicHabit, User } from '../../domain/entities';
import { CommandHandlers } from './commands';
import { AuthController } from './auth.controller';
import { configAppSetting } from '../../config/consts';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([User, HealthTopicHabit]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get(configAppSetting);
        if (!config) {
          throw new Error('Cannot start app without App Setting');
        }
        firebase.initializeApp({
          credential: firebase.credential.cert(config.firebase),
          storageBucket: config.storageBucket,
        });

        return {
          global: true,
          secret: config.jwtSecret,
          signOptions: { expiresIn: '30d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers],
})
export class AuthModule {}
