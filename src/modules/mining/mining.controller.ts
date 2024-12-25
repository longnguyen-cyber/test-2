import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentConsumer, CurrentConsumerInfo } from '../../common/decorator';
import { StartClaimingCommand, StartMiningCommand } from './command';
import { MiningDetailResDto, StartMiningDto } from './dto';
import { CheckMiningQuery, GetAllMiningQuery, GetMiningDetailQuery } from './queries';
import { FilterMiningDto } from './dto/inputs/filter-mining.dto';
import { AuthGuard } from 'src/common/authz';

@Controller('mining')
@ApiTags('mining')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MiningController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Start Mining',
  })
  async startMining(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Body() data: StartMiningDto,
  ): Promise<void> {
    return this.commandBus.execute(new StartMiningCommand(consumer.id, data));
  }

  @Post('claim')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Claim',
  })
  async claiming(@CurrentConsumer() consumer: CurrentConsumerInfo): Promise<void> {
    return this.commandBus.execute(new StartClaimingCommand(consumer.id));
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all mining',
  })
  async getAllMining(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Query() query: FilterMiningDto,
  ): Promise<any> {
    return this.queryBus.execute(new GetAllMiningQuery(query, consumer.id));
  }

  @Get('info')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get mining info',
    type: MiningDetailResDto,
  })
  async getMiningInfo(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
  ): Promise<MiningDetailResDto> {
    return this.queryBus.execute(new GetMiningDetailQuery(consumer.id));
  }

  @Get('check')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check mining',
  })
  async checkMining(@CurrentConsumer() consumer: CurrentConsumerInfo): Promise<any> {
    return this.queryBus.execute(new CheckMiningQuery(consumer.id));
  }
}
