import { GetProfileDetailQueryHandler } from './get-profile-detail';
import { GetTaskProgressQueryHandler } from './get-task-progress';
import { GetUserHabitQueryHandler } from './get-user-habit';

export * from './get-profile-detail';
export * from './get-user-habit';

export * from './get-task-progress';

export const QueryHandlers = [
  GetProfileDetailQueryHandler,
  GetUserHabitQueryHandler,
  GetTaskProgressQueryHandler,
];
