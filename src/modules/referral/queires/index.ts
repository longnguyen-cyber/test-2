import { GetExistReferralQueryHandler } from './exist-referral';
import { GetInfoReferralQueryHandler } from './get-info-referral';

export * from './get-info-referral';
export * from './exist-referral';
export const QueryHandlers = [GetInfoReferralQueryHandler, GetExistReferralQueryHandler];
