import { Injectable, Logger } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { faker } from '@faker-js/faker';

@Injectable()
export class AccountService {
  private logger = new Logger('AccountService');
  constructor(private prismaService: PrismaService) {}

  async getAccountBalance(sim: string): Promise<Account> {
    const result = await this.prismaService.account.findFirst({
      where: {
        sim: sim,
      },
    });

    this.logger.log(result);

    return result;
  }

  async createAccount(dto: CreateAccountDto): Promise<any> {
    const result = await this.prismaService.account.create({
      data: {
        sim: faker.phone.number('080 ### ###'),
        name: dto.name,
        airtime: '0.00',
      },
    });

    this.logger.log(result);
    return result;
  }
}
