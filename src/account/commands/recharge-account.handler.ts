import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RechargeAccountCommand } from './recharge-account.command';
import { AccountRepository } from '../account.repository';
import { PrismaService } from 'src/prisma.service';

@CommandHandler(RechargeAccountCommand)
export class RechargeAccountCommandHandler
  implements ICommandHandler<RechargeAccountCommand>
{
  constructor(private prismaService: PrismaService) {}

  async execute(command: RechargeAccountCommand): Promise<any> {
    // const account = await this.prismaService.account.findFirst({
    //   where: {
    //     sim: command.sim,
    //   },
    // });

    const airtime = await this.prismaService.airtime.findFirst({
      where: {
        code: command.code,
      },
    });
  }
}
