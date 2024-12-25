import { CheckMiningQueryHandler } from './check-mining';
import { GetAllMiningQueryHandler } from './get-all-mining';
import { GetMiningDetailQueryHandler } from './get-mining-detail';

export * from './get-mining-detail';
export * from './get-all-mining';
export * from './check-mining';
export const QueryHandlers = [
  GetMiningDetailQueryHandler,
  GetAllMiningQueryHandler,
  CheckMiningQueryHandler,
];
