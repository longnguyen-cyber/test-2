import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/user.service';
import { MiningDetailResDto } from '../dto';
import { MiningService } from '../mining.service';
import { Mining, User } from '../../../domain/entities';
import { MiningStatus } from '../../../common/constant';

export class GetMiningDetailQuery {
  constructor(public readonly consumerId: string) {}
}

@QueryHandler(GetMiningDetailQuery)
export class GetMiningDetailQueryHandler implements IQueryHandler<GetMiningDetailQuery> {
  constructor(
    @InjectRepository(Mining)
    private readonly miningRepo: Repository<Mining>,
    private readonly userService: UserService,
  ) {}

  async execute(query: GetMiningDetailQuery): Promise<MiningDetailResDto> {
    const { consumerId } = query;

    const miningInfo = await this.userService.getMiningInfo(consumerId);

    const poolMined = await this.miningRepo.count({
      where: {
        status: MiningStatus.FINISHED,
        isClaimed: true,
        isDone: true,
      },
    });

    return plainToInstance(MiningDetailResDto, {
      totalInvite: miningInfo.refCount,
      boost: miningInfo.boost,
      level: miningInfo.level,
      totalPoolMined: poolMined,
    });
  }
}
