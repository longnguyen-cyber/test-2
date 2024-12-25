import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MiningStatus, Nullable, OrderBy } from 'src/common/constant';
import { Mining } from 'src/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MiningService {
  constructor(
    @InjectRepository(Mining)
    private readonly miningRepo: Repository<Mining>,
  ) {}

  async getLastRecord(consumerId: string): Promise<Nullable<Mining>> {
    const mining = await this.miningRepo.findOne({
      where: {
        consumerId,
        status: MiningStatus.PENDING,
        isDone: false,
      },
    });

    return mining;
  }
}
