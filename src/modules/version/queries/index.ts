import { GetLatestVersionQueryHandler } from './get-last-version';
import { GetAllVersionQueryHandler } from './get-version';

export * from './get-version';
export * from './get-last-version';

export const QueryHandlers = [GetAllVersionQueryHandler, GetLatestVersionQueryHandler];
