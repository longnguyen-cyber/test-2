import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Mining } from 'src/domain/entities';
import { Repository } from 'typeorm';
import { FilterMiningDto } from '../dto/inputs/filter-mining.dto';

export class GetAllMiningQuery {
  constructor(public readonly query: FilterMiningDto, public readonly consumerId: string) {}
}

@QueryHandler(GetAllMiningQuery)
export class GetAllMiningQueryHandler {
  constructor(
    @InjectRepository(Mining)
    private readonly miningRepo: Repository<Mining>,
  ) {}

  async execute(input: GetAllMiningQuery) {
    const { query, consumerId } = input;
    const { page, limit, sortBy, sortDir } = query;
    const [data, total] = await this.miningRepo
      .createQueryBuilder('mining')
      .where('mining.consumerId = :consumerId and mining.isClaimed = true', { consumerId })
      .orderBy(`mining.${sortBy}`, sortDir as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .addSelect(['mining.createdAt'])
      .getManyAndCount();

    return { data, total, page, limit };
  }
}
