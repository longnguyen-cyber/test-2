import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const RoleKeyMetadata = 'roles';

export enum SeimRole {
  Admin = 'admin',
  Owner = 'owner',
  User = 'user',
}

export const Roles = (...roles: SeimRole[]): CustomDecorator => SetMetadata(RoleKeyMetadata, roles);

export const AnonymousKeyMetadata = 'anonymous';

export const AnonymousEndpoint = SetMetadata(AnonymousKeyMetadata, true);
