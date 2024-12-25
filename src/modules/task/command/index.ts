import { CompleteTaskCommandHandler } from './complete-task';
import { UnCompleteTaskCommandHandler } from './uncomplete-task';
import { UploadTaskCommandHandler } from './upload-task';

export * from './complete-task';
export * from './uncomplete-task';
export * from './upload-task';

export const CommandHandlers = [
  CompleteTaskCommandHandler,
  UnCompleteTaskCommandHandler,
  UploadTaskCommandHandler,
];
