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
import { Account } from '@prisma/client';
import { AccountBalanceGuard, AccountParamGuard } from './account.guard';
import { RechargeAirtimeExceptionFilter } from './filters/exception.filter';
import { RechargeAccountDto } from './dto/recharge-account.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAccountQuery } from './queries/get-account.query';
import { RechargeAccountCommand } from './commands/recharge-account.command';
import { Result, match } from 'oxide.ts';
import { RechargeAirtimeException } from './account.exception';

@Controller('account')
export class AccountController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  @UseGuards(AccountBalanceGuard)
  async accountBalance(@Query('sim') sim: string): Promise<Account> {
    return await this.queryBus.execute(new GetAccountQuery(sim));
  }

  @Post(':sim/recharge')
  @UseGuards(AccountParamGuard)
  @UseFilters(RechargeAirtimeExceptionFilter)
  async rechargeAccount(
    @Param('sim') sim: string,
    @Body() dto: RechargeAccountDto,
  ): Promise<void> {
    const command = new RechargeAccountCommand(sim, dto.code);

    const result: Result<null, RechargeAirtimeException> =
      await this.commandBus.execute(command);

    match(result, {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      Ok: () => {},
      Err: (error: RechargeAirtimeException) => {
        throw error;
      },
    });
  }
}
