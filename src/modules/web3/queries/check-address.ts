import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Web3Service } from '../web3.service';

export class CheckAddressQuery {
  constructor(public readonly address: string) {}
}

@QueryHandler(CheckAddressQuery)
export class CheckAddressQueryHandler implements IQueryHandler<CheckAddressQuery> {
  constructor(private readonly web3Service: Web3Service) {}

  async execute(input: CheckAddressQuery): Promise<boolean> {
    const { address } = input;
    const response = await this.web3Service.checkAddressCheckSum(address);
    console.log(response);
    return response;
  }
}
