import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export * from './auth.guard';
export * from './consumer.guard';

export const AnonymousKeyMetadata = 'anonymous';

export const IsAnonymousEndpoint = (context: ExecutionContext, reflector: Reflector): boolean => {
  const result: boolean | undefined = reflector.get<boolean>(
    AnonymousKeyMetadata,
    context.getHandler(),
  );
  // `|| false` means that by default, all endpoints should be guard
  return result || false;
};
