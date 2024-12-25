import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Version } from 'src/domain/entities';
import { DataSource, Repository } from 'typeorm';
import { VersionResDto } from '../dto';
import { plainToInstance } from 'class-transformer';
import { Platform } from 'src/common/constant/platform.enum';
import { SeimBadRequestException } from 'src/common/exception';

export class GetLatestVersionQuery {
  constructor(public readonly platform: string) {}
}

@QueryHandler(GetLatestVersionQuery)
export class GetLatestVersionQueryHandler implements IQueryHandler<GetLatestVersionQuery> {
  constructor(
    @InjectRepository(Version)
    private readonly versionRepo: Repository<Version>,
  ) {}

  async execute(input: GetLatestVersionQuery): Promise<VersionResDto> {
    try {
      const { platform } = input;
      const version = await this.versionRepo.find({
        order: {
          createdAt: 'DESC',
        },
        where: {
          platform: platform === 'android' ? Platform.ANDROID : Platform.IOS,
        },
        take: 1,
      });
      return plainToInstance(VersionResDto, version[0]);
    } catch (error) {
      console.log(error);
      throw new SeimBadRequestException('An unexpected error occurred');
    }
  }
}
