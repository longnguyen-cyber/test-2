import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/entities';
import { UserService } from 'src/modules/user/user.service';
import { Repository } from 'typeorm';
import { ReferralInfoDto } from '../dto/responses/referral-info.dto';
import { plainToInstance } from 'class-transformer';

export class GetInfoReferralQuery {
  constructor(public readonly consumerId: string) {}
}

@QueryHandler(GetInfoReferralQuery)
export class GetInfoReferralQueryHandler implements IQueryHandler<GetInfoReferralQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async execute(query: GetInfoReferralQuery): Promise<ReferralInfoDto> {
    const { consumerId } = query;

    const referralInfo = await this.userService.getReferralInfo(consumerId);

    return plainToInstance(ReferralInfoDto, {
      totalInvited: referralInfo.totalInvited,
      totalValid: referralInfo.totalValid,
      totalEarned: referralInfo.totalInvited,
    });
  }
}
