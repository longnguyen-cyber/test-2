import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddNewVersionCommand, UpdateVersionCommand } from './commands';
import { AddVersionRequestDto, UpdateVersionRequestDto } from './dto';
import { GetAllVersionQuery, GetLatestVersionQuery } from './queries';
import { Platform, PlatformInfo } from 'src/common/decorator';
import { SeimBadRequestException } from 'src/common/exception';

@Controller('version')
@ApiTags('version')
export class VersionController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all versions',
  })
  async getAllVersion(): Promise<any> {
    return this.queryBus.execute(new GetAllVersionQuery());
  }

  @Get('latest')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get latest version',
  })
  async getLatestVersion(@Platform() platform: PlatformInfo): Promise<any> {
    return this.queryBus.execute(new GetLatestVersionQuery(platform.platform));
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update version',
  })
  @ApiBody({
    description: 'List of versions to update',
    type: [AddVersionRequestDto],
    examples: {
      example1: {
        summary: 'Example 1',
        value: [
          {
            version: 1,
            platform: 'android',
            url: 'http://example.com',
          },
          {
            version: 1,
            platform: 'ios',
            url: 'https://example.org',
          },
        ],
      },
    },
  })
  async addVersion(@Body() data: AddVersionRequestDto[]): Promise<any> {
    if (data.length !== 2) {
      throw new SeimBadRequestException('Invalid data');
    }
    return this.commandBus.execute(new AddNewVersionCommand(data));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update version',
  })
  @ApiBody({
    description: 'Update version',
    type: AddVersionRequestDto,
    examples: {
      example1: {
        summary: 'Example 1',
        value: {
          version: '1',
          url: 'http://example.com',
        },
      },
    },
  })
  async updateVersion(
    @Body() data: UpdateVersionRequestDto,
    @Query('id') id: string,
  ): Promise<any> {
    return this.commandBus.execute(new UpdateVersionCommand(data, id));
  }
}
