import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AccountModel, AccountModelProps } from './account.model';

@Injectable()
export class AccountRepository {
  constructor(private prismaService: PrismaService) {}

  async findAccountBySIM(sim: string): Promise<AccountModelProps> {
    const result = await this.prismaService.account.findUnique({
      where: {
        sim: sim,
      },
    });

    const account = new AccountModel({
      id: result.id,
      sim: result.sim,
      name: result.name,
      airtime: result.airtime,
    });

    return account.props;
  }
}
