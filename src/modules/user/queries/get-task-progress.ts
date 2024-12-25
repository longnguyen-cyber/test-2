import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from '../user.service';

export class GetTaskProgressQuery {
  constructor(public readonly consumerId: string) {}
}

@QueryHandler(GetTaskProgressQuery)
export class GetTaskProgressQueryHandler implements IQueryHandler<GetTaskProgressQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(input: GetTaskProgressQuery): Promise<any> {
    const { consumerId } = input;
    return await this.userService.checkProgress(consumerId);
  }
}
