import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Web3Service } from '../web3.service';

export class CheckBalanceQuery {
  constructor(public readonly address: string) {}
}

@QueryHandler(CheckBalanceQuery)
export class CheckBalanceQueryHandler implements IQueryHandler<CheckBalanceQuery> {
  constructor(private readonly web3Service: Web3Service) {}

  async execute(input: CheckBalanceQuery): Promise<string> {
    const { address } = input;
    return this.web3Service.getBalance(address);
  }
}
