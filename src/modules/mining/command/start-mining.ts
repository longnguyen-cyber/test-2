import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { UserService } from 'src/modules/user/user.service';
import { SeimBadRequestException } from 'src/common/exception';
import { Mining, User } from '../../../domain/entities';
import { MiningService } from '../mining.service';
import { StartMiningDto } from '../dto';
import { MiningStatus } from 'src/common/constant';

export class StartMiningCommand {
  constructor(public readonly consumerId: string, public readonly data: StartMiningDto) {}
}

@CommandHandler(StartMiningCommand)
export class StartMiningCommandHandler implements ICommandHandler<StartMiningCommand> {
  constructor(
    @InjectRepository(Mining)
    private readonly miningRepo: Repository<Mining>,
    private readonly miningService: MiningService,
  ) {}

  async execute(input: StartMiningCommand): Promise<void> {
    const { consumerId, data } = input;

    const lastRecord = await this.miningService.getLastRecord(consumerId);
    if (lastRecord) {
      throw new SeimBadRequestException('Mining existed');
    }

    await this.miningRepo.insert({
      consumerId,
      ...data,
      status: MiningStatus.PENDING,
    });
  }
}
