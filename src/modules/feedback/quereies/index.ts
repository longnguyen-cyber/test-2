import { GetFeedbackQueryHandler } from './get-feedback.dto';
import { GetFeedbacksQueryHandler } from './get-feedbacks.dto';

export * from './get-feedback.dto';
export * from './get-feedbacks.dto';

export const QueryHandlers = [GetFeedbackQueryHandler, GetFeedbacksQueryHandler];
