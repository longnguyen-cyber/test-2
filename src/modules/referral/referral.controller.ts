import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/authz';
import { AddReferralCommand } from './commands';
import { CurrentConsumer, CurrentConsumerInfo } from 'src/common/decorator';
import { AddReferral } from './dto/inputs/add-referral.dto';
import {
  GetExistReferralQuery,
  GetInfoReferralQuery,
  GetInfoReferralQueryHandler,
} from './queires';

@Controller('referral')
@ApiTags('referral')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReferralController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Add Referral',
  })
  async addReferral(
    @CurrentConsumer() consumer: CurrentConsumerInfo,
    @Body() data: AddReferral,
  ): Promise<void> {
    return this.commandBus.execute(new AddReferralCommand(consumer.id, data.referralCode));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all referral',
  })
  async getAllReferral(@CurrentConsumer() consumer: CurrentConsumerInfo): Promise<any> {
    return this.queryBus.execute(new GetInfoReferralQuery(consumer.id));
  }

  @Get('exist')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check referral exist',
  })
  async checkReferralExist(@CurrentConsumer() consumer: CurrentConsumerInfo): Promise<boolean> {
    return this.queryBus.execute(new GetExistReferralQuery(consumer.id));
  }
}
