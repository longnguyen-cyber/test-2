import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SeimBadRequestException } from 'src/common/exception';
import { User } from '../../../domain/entities';
import { UpdateProfileRequestDto } from '../dto/inputs';

export class UpdateProfileCommand {
  constructor(public readonly consumerId: string, public readonly data: UpdateProfileRequestDto) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(input: UpdateProfileCommand): Promise<void> {
    const { consumerId, data } = input;

    if (data.referBy) {
      const currentUser = await this.userRepo.findOne({ where: { id: consumerId } });
      if (currentUser?.referBy) throw new SeimBadRequestException('Your referer was existed.');

      const refUser = await this.userRepo.findOne({ where: { refererCode: data.referBy } });
      if (!refUser) throw new SeimBadRequestException('Referby Code does not exist.');
      data.referBy = refUser.id;
    }

    await this.userRepo.update(consumerId, {
      ...data,
      isVerified: data.wallet ? true : false,
    });
  }
}
