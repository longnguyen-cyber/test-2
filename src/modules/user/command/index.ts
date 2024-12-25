import { CreateUserHabitCommandHandler } from './create-user-habit';
import { DeleteUserHabitCommandHandler } from './delete-user-habit';
import { UpdateProfileCommandHandler } from './update-profile';
import { UpdateUserHabitCommandHandler } from './update-user-habit';
import { UploadUserHabitCommandHandler } from './upload-user-habit';

export * from './create-user-habit';
export * from './delete-user-habit';
export * from './update-user-habit';
export * from './update-profile';

export const CommandHandlers = [
  CreateUserHabitCommandHandler,
  DeleteUserHabitCommandHandler,
  UpdateUserHabitCommandHandler,
  UpdateProfileCommandHandler,
  UploadUserHabitCommandHandler,
];
