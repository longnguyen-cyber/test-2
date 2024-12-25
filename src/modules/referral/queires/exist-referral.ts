import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities';
import { UserService } from 'src/modules/user/user.service';
import { Repository } from 'typeorm';
import { ReferralInfoDto } from '../dto/responses/referral-info.dto';
import { plainToInstance } from 'class-transformer';

export class GetExistReferralQuery {
  constructor(public readonly consumerId: string) {}
}

@QueryHandler(GetExistReferralQuery)
export class GetExistReferralQueryHandler implements IQueryHandler<GetExistReferralQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(query: GetExistReferralQuery): Promise<boolean> {
    const { consumerId } = query;

    const referralInfo = await this.userRepo.findOne({
      where: { id: consumerId },
      select: ['referBy'],
    });

    return !!referralInfo?.referBy;
  }
}
