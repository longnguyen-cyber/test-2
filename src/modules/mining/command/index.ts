import { StartClaimingCommandHandler } from './start-claiming';
import { StartMiningCommandHandler } from './start-mining';

export * from './start-mining';
export * from './start-claiming';

export const CommandHandlers = [StartMiningCommandHandler, StartClaimingCommandHandler];
