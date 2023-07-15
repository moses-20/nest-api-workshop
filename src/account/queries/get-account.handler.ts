import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountQuery } from './get-account.query';
import { AccountRepository } from '../account.repository';
import { AccountModelProps } from '../account.model';

@QueryHandler(GetAccountQuery)
export class GetAccountQueryHandler implements IQueryHandler<GetAccountQuery> {
  constructor(private repository: AccountRepository) {}

  async execute(query: GetAccountQuery): Promise<AccountModelProps> {
    return this.repository.findAccountBySIM(query.sim);
  }
}
