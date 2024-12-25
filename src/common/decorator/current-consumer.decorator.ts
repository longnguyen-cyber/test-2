import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type CurrentConsumerInfo = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isProfileVerified?: boolean;
};

export const CurrentConsumer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentConsumerInfo => {
    const jwtService: JwtService = new JwtService();
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['authorization'].split(' ')[1];
    const consumerInfo = jwtService.decode(token) as CurrentConsumerInfo;
    return consumerInfo;
  },
);
