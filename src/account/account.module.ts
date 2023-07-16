import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { PrismaService } from 'src/prisma.service';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAccountQueryHandler } from './queries/get-account.handler';
import { RechargeAccountCommandHandler } from './commands/recharge-account.handler';

@Module({
  imports: [CqrsModule],
  controllers: [AccountController],
  providers: [
    PrismaService,
    GetAccountQueryHandler,
    RechargeAccountCommandHandler,
  ],
})
export class AccountModule {}
