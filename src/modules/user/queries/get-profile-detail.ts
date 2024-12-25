import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ProfileDetailResDto } from '../dto';
import { Mining, User } from '../../../domain/entities';
import { SeimBadRequestException } from '../../../common/exception';
import { InjectRepository } from '@nestjs/typeorm';

export class GetProfileDetailQuery {
  constructor(public readonly consumerId: string) {}
}

@QueryHandler(GetProfileDetailQuery)
export class GetProfileDetailQueryHandler implements IQueryHandler<GetProfileDetailQuery> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Mining)
    private readonly miningRepo: Repository<Mining>,
  ) {}

  async execute(input: GetProfileDetailQuery): Promise<ProfileDetailResDto> {
    const { consumerId } = input;
    const user = await this.dataSource
      .createQueryBuilder(User, 'user')
      .where('user.id = :id', { id: consumerId })
      .andWhere('user.isDeleted = false')
      .select([
        'user.email',
        'user.name',
        'user.phone',
        'user.avatar',
        'user.wallet',
        'user.refererCode',
        'user.point',
        'user.exp',
        'user.level',
        'user.gender',
        'user.old',
        'user.height',
        'user.weight',
      ])
      .getOne();

    const totalEarnedResult = await this.miningRepo.count({
      where: { consumerId, isClaimed: true },
    });

    if (!user) throw new SeimBadRequestException('User not found');

    return plainToInstance(ProfileDetailResDto, {
      ...user,
      miningEarned: totalEarnedResult,
    });
  }
}
