import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountBalanceGuard, AccountParamGuard } from './account.guard';
import { AddBeneficiaryDto } from './dto/add-beneficiary.dto';
import { NoBeneficiaryExceptionFilter } from './filters/exception.filter';
import { RechargeAccountDto } from './dto/recharge-account.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAccountQuery } from './queries/get-account.query';

@Controller('account')
@UseFilters(NoBeneficiaryExceptionFilter)
export class AccountController {
  constructor(
    private accountService: AccountService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(AccountBalanceGuard)
  async accountBalance(@Query('sim') sim: string): Promise<Account> {
    return await this.queryBus.execute(new GetAccountQuery(sim));
  }

  @Post()
  async createAccount(@Body() dto: CreateAccountDto): Promise<Account> {
    return await this.accountService.createAccount(dto);
  }

  @Get(':sim/beneficiary')
  @UseGuards(AccountParamGuard)
  async getBeneficiary(@Param('sim') sim: string): Promise<Account> {
    return this.accountService.getBeneficiary(sim);
  }

  @Post(':sim/beneficiary')
  @UseGuards(AccountParamGuard)
  async addAccountBeneficiary(
    @Param('sim') sim: string,
    @Body() beneficiary: AddBeneficiaryDto,
  ): Promise<Account> {
    return this.accountService.addBeneficiary(sim, +beneficiary.beneficiaryId);
  }

  @Post(':sim/recharge')
  @UseGuards(AccountParamGuard)
  async rechargeAccount(
    @Param('sim') sim: string,
    @Body() dto: RechargeAccountDto,
  ): Promise<Account> {
    return await this.accountService.rechargeAccount(sim, dto.code);
  }
}
