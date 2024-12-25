import { CommandHandler } from '@nestjs/cqrs';
import { CreateFeedback } from '../inputs/create-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from 'src/domain/entities/feedback.entity';

export class CreateFeedbackCommand {
  constructor(
    public readonly feedback: CreateFeedback,

    public readonly consumerId: string,
  ) {}
}

@CommandHandler(CreateFeedbackCommand)
export class CreateFeedbackCommandHandler {
  constructor(
    @InjectRepository(Feedback) private readonly feedbackRepository: Repository<Feedback>,
  ) {}
  async execute(command: CreateFeedbackCommand): Promise<string> {
    const { feedback, consumerId } = command;
    try {
      await this.feedbackRepository.save({
        consumerId,
        content: feedback.content,
        name: feedback.name,
      });
      return 'Feedback created';
    } catch (error) {
      console.log(error);
      return 'Feedback created failed';
    }
  }
}
