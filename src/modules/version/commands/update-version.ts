import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Version } from 'src/domain/entities';
import { Repository } from 'typeorm';
import { SeimBadRequestException } from '../../../common/exception';
import { UpdateVersionRequestDto } from '../dto';

export class UpdateVersionCommand {
  constructor(
    public readonly data: UpdateVersionRequestDto,
    public readonly versionId: string,
    public readonly adminId?: string,
  ) {}
}

@CommandHandler(UpdateVersionCommand)
export class UpdateVersionCommandHandler implements ICommandHandler<UpdateVersionCommand> {
  constructor(
    @InjectRepository(Version)
    private readonly versionRepo: Repository<Version>,
  ) {}

  async execute(input: UpdateVersionCommand): Promise<boolean> {
    try {
      const { data, adminId, versionId } = input;
      // const isAdmin = await this.versionRepo.findOne({ where: { id: adminId } });

      const version = await this.versionRepo.findOne({ where: { id: versionId } });
      if (!version) {
        throw new SeimBadRequestException('Version not found');
      }

      await this.versionRepo.update(versionId, data);
      return true;
    } catch (error) {
      console.error(error);
      throw new SeimBadRequestException('An unexpected error occurred');
    }
  }
}
