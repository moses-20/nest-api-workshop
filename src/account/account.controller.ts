import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountBalanceGuard } from '../guards/account.guard';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  @UseGuards(AccountBalanceGuard)
  async accountBalance(@Query('sim') sim: string): Promise<Account | string> {
    return await this.accountService.getAccountBalance(sim);
  }

  @Post()
  async createAccount(@Body() dto: CreateAccountDto): Promise<Account> {
    return await this.accountService.createAccount(dto);
  }
}
