import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { MiningStatus } from 'src/common/constant';
import { SeimBadRequestException } from 'src/common/exception';
import { UserService } from 'src/modules/user/user.service';
import { Repository } from 'typeorm';
import { Mining, User } from '../../../domain/entities';
import { MiningService } from '../mining.service';

export class StartClaimingCommand {
  constructor(public readonly consumerId: string) {}
}

@CommandHandler(StartClaimingCommand)
export class StartClaimingCommandHandler implements ICommandHandler<StartClaimingCommand> {
  constructor(
    @InjectRepository(Mining)
    private readonly miningRepo: Repository<Mining>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly miningService: MiningService,
    private readonly userService: UserService,
  ) {}

  async execute(input: StartClaimingCommand): Promise<void> {
    const { consumerId } = input;

    const lastRecord = await this.miningService.getLastRecord(consumerId);

    if (!lastRecord) throw new SeimBadRequestException('Mining does not existed');
    const currentTime = new Date().getTime();
    if (currentTime > lastRecord.endDate) {
      const user = await this.userRepo.findOneOrFail({
        where: { id: consumerId },
        select: ['point'],
      });

      const userPoint = parseFloat(user.point.toString()) || 0;
      const lastRecordPoint = parseFloat(lastRecord.point.toString()) || 0;

      await this.userRepo.update(consumerId, {
        point: userPoint + lastRecordPoint,
      });
      await this.miningRepo.update(lastRecord.id, {
        status: MiningStatus.FINISHED,
        isClaimed: true,
        isDone: true,
      });
    } else {
      throw new SeimBadRequestException('Mining had not ended yet.');
    }
  }
}
