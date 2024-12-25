import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type PlatformInfo = {
  platform: string;
};

export const Platform = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PlatformInfo => {
    const request = ctx.switchToHttp().getRequest();
    const platform = request.headers['x-custom-platform'];
    return { platform: platform.toLowerCase() };
  },
);
