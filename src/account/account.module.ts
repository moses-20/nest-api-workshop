import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma.service';
import { AccountRepository } from './account.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAccountQueryHandler } from './queries/get-account.handler';

@Module({
  imports: [CqrsModule],
  controllers: [AccountController],
  providers: [
    AccountService,
    AccountRepository,
    PrismaService,
    GetAccountQueryHandler,
  ],
})
export class AccountModule {}
