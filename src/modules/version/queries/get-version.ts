import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Version } from 'src/domain/entities';
import { DataSource, Repository } from 'typeorm';
import { VersionResDto } from '../dto';
import { plainToInstance } from 'class-transformer';

export class GetAllVersionQuery {
  constructor() {}
}

@QueryHandler(GetAllVersionQuery)
export class GetAllVersionQueryHandler implements IQueryHandler<GetAllVersionQuery> {
  constructor(
    @InjectRepository(Version)
    private readonly versionRepo: Repository<Version>,
  ) {}

  async execute(): Promise<VersionResDto[]> {
    try {
      const versions = await this.versionRepo.find();
      return plainToInstance(VersionResDto, versions);
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
