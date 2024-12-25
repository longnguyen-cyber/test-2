import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IsAnonymousEndpoint } from './index';
import { SeimUnauthorizedException } from '../exception';

@Injectable()
export class ConsumerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (IsAnonymousEndpoint(context, this.reflector)) return true;

    const request = context.switchToHttp().getRequest();
    if (!request.headers['seim-consumer']) {
      throw new SeimUnauthorizedException('Consumer does not exist!');
    }

    return true;
  }
}
