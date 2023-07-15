import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Account, Airtime } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { faker } from '@faker-js/faker';
import { NoBeneficiaryException } from './account.exception';

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

    if (result == undefined) {
      throw new BadRequestException(`Subscriber ${sim} does not exist`);
    }

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

  async getBeneficiary(sim: string): Promise<Account> {
    const account = await this.prismaService.account.findUnique({
      where: {
        sim: sim,
      },
      include: {
        beneficiary: true,
      },
    });

    if (account == undefined) {
      throw new BadRequestException(`Subscriber ${sim} does not exist`);
    }

    if (account.beneficiary == undefined) {
      throw new NoBeneficiaryException(sim);
    }

    return account.beneficiary;
  }

  async addBeneficiary(sim: string, beneficiaryId: number): Promise<any> {
    const account = await this.prismaService.account.findUnique({
      where: {
        sim: sim,
      },
    });

    if (account == undefined) {
      throw new BadRequestException(`Subscriber ${sim} does not exist`);
    }

    const beneficiary = await this.prismaService.account.findFirst({
      where: {
        id: beneficiaryId,
      },
    });

    if (beneficiary == undefined) {
      throw new BadRequestException(
        `Subscriber with ID ${beneficiaryId} does not exist`,
      );
    }

    return await this.prismaService.account.update({
      where: {
        id: account.id,
      },
      data: {
        beneficiaryId: beneficiaryId,
      },
    });
  }

  async rechargeAccount(
    sim: string,
    code: string,
  ): Promise<Account | undefined> {
    const airtime = await this.prismaService.airtime.findFirst({
      where: {
        code: code,
      },
    });

    if (airtime == undefined) {
      throw new BadRequestException(`Airtime with code ${code} does not exist`);
    }

    if (airtime.valid == false) {
      throw new BadRequestException(`Airtime with code ${code} has been used`);
    }

    const account = await this.prismaService.account.findUnique({
      where: {
        sim: sim,
      },
      include: {
        beneficiary: true,
      },
    });

    if (+airtime.value > 100) {
      this.updateBeneficiaryAccount(account.beneficiary, airtime.value);
    }

    const newBalance = this.calculateAccountBalance(account, airtime);

    await this.prismaService.airtime.update({
      where: {
        id: airtime.id,
      },
      data: {
        valid: false,
      },
    });

    const result = await this.prismaService.account.update({
      where: {
        sim: sim,
      },
      data: {
        airtime: newBalance.toString(),
      },
    });

    return result;
  }

  private calculateAccountBalance(account: Account, airtime: Airtime): number {
    const airtimeValue = +airtime.value;
    const accountBalance: number = +account.airtime;

    return airtimeValue + accountBalance;
  }

  private async updateBeneficiaryAccount(
    beneficiary: Account,
    airtimeValue: string,
  ): Promise<void> {
    const bonus = +airtimeValue / 2;
    const oldBeneficiaryAirtime = +beneficiary.airtime;
    const newBeneficiaryAirtime = bonus + oldBeneficiaryAirtime;

    await this.prismaService.account.update({
      where: {
        sim: beneficiary.sim,
      },
      data: {
        airtime: newBeneficiaryAirtime.toString(),
      },
    });
  }
}
