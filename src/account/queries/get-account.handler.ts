import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountQuery } from './get-account.query';
import { AccountModelProps } from '../account.model';
import { PrismaService } from 'src/prisma.service';

@QueryHandler(GetAccountQuery)
export class GetAccountQueryHandler implements IQueryHandler<GetAccountQuery> {
  constructor(private prismaService: PrismaService) {}

  async execute(query: GetAccountQuery): Promise<AccountModelProps> {
    const result = await this.prismaService.account.findFirst({
      where: {
        sim: query.sim,
      },
    });

    return {
      id: result.id,
      name: result.name,
      sim: result.name,
      airtime: result.airtime,
    };
  }
}
