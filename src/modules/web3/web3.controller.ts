import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CheckAddressQuery, CheckBalanceQuery } from './queries';

@Controller('web3')
@ApiTags('web3')
export class Web3Controller {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Get('check-balance/:address')
  async checkBalance(@Param('address') address: string) {
    return this.queryBus.execute(new CheckBalanceQuery(address));
  }

  @Get('check-address/:address')
  async checkAddress(@Param('address') address: string) {
    return this.queryBus.execute(new CheckAddressQuery(address));
  }
}
