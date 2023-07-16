import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RechargeAccountCommand } from './recharge-account.command';
import { PrismaService } from 'src/prisma.service';
import { Result, Ok, Err } from 'oxide.ts';
import {
  AccountNotFoundException,
  RechargeAirtimeException,
  InvalidAirtimeException,
} from '../account.exception';
import { AccountModel } from '../account.model';

@CommandHandler(RechargeAccountCommand)
export class RechargeAccountCommandHandler
  implements ICommandHandler<RechargeAccountCommand>
{
  constructor(private prismaService: PrismaService) {}

  async execute(
    command: RechargeAccountCommand,
  ): Promise<Result<null, RechargeAirtimeException>> {
    try {
      const [accountDB, airtimeDB] = await this.prismaService.$transaction([
        this.prismaService.account.findFirst({
          where: {
            sim: command.sim,
          },
          include: {
            beneficiary: true,
          },
        }),
        this.prismaService.airtime.findFirst({
          where: {
            code: command.code,
          },
        }),
      ]);

      if (airtimeDB == null || airtimeDB.valid == false) {
        throw new InvalidAirtimeException(command.code);
      }

      if (accountDB == null) {
        throw new AccountNotFoundException(command.sim);
      }

      const account = new AccountModel({
        id: accountDB.id,
        airtime: accountDB.airtime,
        name: accountDB.name,
        sim: accountDB.sim,
        beneficiary:
          accountDB.beneficiary == null
            ? null
            : {
                id: accountDB.beneficiary.id,
                airtime: accountDB.beneficiary.airtime,
                name: accountDB.beneficiary.name,
                sim: accountDB.beneficiary.sim,
              },
      });

      const accountResult = account.recharge(
        +airtimeDB.value,
        account.props.name,
      );

      let beneficiaryResult: string;

      if (account.props.beneficiary != null) {
        const beneficiary = new AccountModel({
          id: accountDB.beneficiary.id,
          airtime: accountDB.beneficiary.airtime,
          name: accountDB.beneficiary.name,
          sim: accountDB.beneficiary.sim,
        });

        beneficiaryResult = beneficiary.recharge(
          +airtimeDB.value / 2,
          beneficiary.props.name,
        );
      }

      await this.prismaService.$transaction([
        this.prismaService.airtime.update({
          where: {
            id: airtimeDB.id,
          },
          data: {
            valid: false,
          },
        }),
        this.prismaService.account.update({
          where: {
            sim: command.sim,
          },
          data: {
            airtime: accountResult,
            beneficiary:
              account.props.beneficiary == null
                ? undefined
                : {
                    update: {
                      airtime: beneficiaryResult,
                    },
                  },
          },
        }),
      ]);

      return Ok(null);
    } catch (error) {
      if (error instanceof RechargeAirtimeException) {
        return Err(error);
      }

      throw error;
    }
  }
}
