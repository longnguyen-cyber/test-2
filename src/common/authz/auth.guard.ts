import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { IsAnonymousEndpoint } from './index';
import { SeimUnauthorizedException } from '../exception';
import { configAppSetting } from '../../config/consts';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (IsAnonymousEndpoint(context, this.reflector)) return true;
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new SeimUnauthorizedException('Authorization Header does not contain Bearer token');
    }
    const config = this.configService.get(configAppSetting);

  try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.jwtSecret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.headers['seim-consumer'] = JSON.stringify(payload);
    } catch {
      throw new SeimUnauthorizedException('Token is not validated');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
