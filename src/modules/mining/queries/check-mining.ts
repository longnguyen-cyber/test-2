import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Mining } from 'src/domain/entities';
import { Repository } from 'typeorm';
import { MiningDetailResDto } from '../dto';
import { MiningService } from '../mining.service';
import { MiningResDto } from '../dto/responses/mining-res.dto';

export class CheckMiningQuery {
  constructor(public readonly consumerId: string) {}
}

@QueryHandler(CheckMiningQuery)
export class CheckMiningQueryHandler implements IQueryHandler<CheckMiningQuery> {
  constructor(
    @InjectRepository(Mining)
    private readonly miningRepo: Repository<Mining>,
    private readonly miningService: MiningService,
  ) {}

  async execute(input: CheckMiningQuery): Promise<MiningResDto | null> {
    const { consumerId } = input;
    const lastRecord = await this.miningService.getLastRecord(consumerId);
    if (lastRecord) {
      const data = {
        startDate: Number(lastRecord.startDate),
        endDate: Number(lastRecord.endDate),
        point: lastRecord.point,
        boost: lastRecord.boost,
        deviceId: lastRecord.deviceId,
        isClaimed: lastRecord.isClaimed,
        isDone: lastRecord.isDone,
      };
      return data;
    } else {
      return null;
    }
  }
}
