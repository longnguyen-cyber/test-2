import { AddNewVersionCommandHandler } from './add-version';
import { UpdateVersionCommandHandler } from './update-version';

export * from './add-version';
export * from './update-version';
export const CommandHandlers = [AddNewVersionCommandHandler, UpdateVersionCommandHandler];
