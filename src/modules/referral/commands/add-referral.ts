import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SeimBadRequestException } from 'src/common/exception';
import { Mining, User } from 'src/domain/entities';
import { UserService } from 'src/modules/user/user.service';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { MiningStatus } from 'src/common/constant';

export class AddReferralCommand {
  constructor(public readonly consumerId: string, public readonly referralCode: string) {}
}

@CommandHandler(AddReferralCommand)
export class AddReferralCommandHandler implements ICommandHandler<AddReferralCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
    @InjectRepository(Mining)
    private readonly miningRepo: Repository<Mining>,
  ) {}

  async execute(command: AddReferralCommand): Promise<void> {
    const { consumerId, referralCode } = command;

    try {
      const referral = await this.userService.getUserInfoByReferralCode(referralCode);
      const miningInfoConsumer = await this.userService.getMiningInfo(consumerId);
      const miningInfoReferral = await this.userService.getMiningInfo(referral.id);

      if (!referral) throw new SeimBadRequestException('Referral code is invalid');

      const isReferralExist = await this.userRepo.findOne({
        where: {
          id: consumerId,
          referBy: referral.id,
        },
      });

      if (isReferralExist) throw new SeimBadRequestException('Referral code is already used');

      const miningReferral = {
        consumerId: referral.id,
        startDate: dayjs().toDate().getTime(),
        endDate: dayjs().toDate().getTime(),
        point: 1,
        level: referral.level,
        miningRate: 1,
        isDone: true,
        boost: miningInfoReferral.boost,
        isClaimed: true,
        status: MiningStatus.FINISHED,
      };
      await this.miningRepo.insert(miningReferral);
      //increase point for referral
      await this.userRepo
        .createQueryBuilder()
        .update(User)
        .set({
          point: () => 'point + 1',
        })
        .where('id = :id', { id: referral.id })
        .execute();
      //add history for referral

      //increase point for consumer
      const consumer = await this.userService.getUserInfo(consumerId);
      const miningConsumer = {
        consumerId: consumer.id,
        startDate: dayjs().toDate().getTime(),
        endDate: dayjs().toDate().getTime(),
        point: 1,
        level: consumer.level,
        miningRate: 1,
        isDone: true,
        boost: miningInfoConsumer.boost,
        isClaimed: true,
        status: MiningStatus.FINISHED,
      };
      await this.miningRepo.insert(miningConsumer);
      await this.userRepo
        .createQueryBuilder()
        .update(User)
        .set({
          point: () => 'point + 1',
          referBy: referral.id,
        })
        .where('id = :id', { id: consumerId })
        .execute();
    } catch (error: any) {
      throw new SeimBadRequestException(error.message);
    }
  }
}
