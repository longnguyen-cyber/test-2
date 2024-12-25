import { CheckAddressQueryHandler } from './check-address';
import { CheckBalanceQueryHandler } from './check-balance';

export * from './check-balance';
export * from './check-address';

export const QueryHandlers = [CheckBalanceQueryHandler, CheckAddressQueryHandler];
