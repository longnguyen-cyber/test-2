import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Version } from 'src/domain/entities';
import { Repository } from 'typeorm';
import { SeimBadRequestException } from '../../../common/exception';
import { AddVersionRequestDto } from '../dto/inputs/add-version-request.dto';
import { VersionResDto } from '../dto/responses/version-res.dto';
import { Platform } from 'src/common/constant/platform.enum';

export class AddNewVersionCommand {
  constructor(public readonly data: AddVersionRequestDto[]) {}
}

@CommandHandler(AddNewVersionCommand)
export class AddNewVersionCommandHandler implements ICommandHandler<AddNewVersionCommand> {
  constructor(
    @InjectRepository(Version)
    private readonly versionRepo: Repository<Version>,
  ) {}

  async execute(command: AddNewVersionCommand) {
    try {
      const { data } = command;
      await this.versionRepo.save(data.map((v) => ({ ...v, platform: v.platform as Platform })));
    } catch (error) {
      console.error(error);
      throw new SeimBadRequestException('An unexpected error occurred');
    }
  }
}
