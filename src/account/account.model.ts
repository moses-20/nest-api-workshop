import { AggregateRoot } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

export interface AccountModelProps {
  id: number;
  name: string;
  sim: string;
  airtime: string;
  beneficiary?: AccountModelProps;
}

export class AccountModel extends AggregateRoot {
  private logger = new Logger('AccountModel');

  constructor(readonly props: AccountModelProps) {
    super();
  }

  recharge(airtime: number, name: string): string {
    this.logger.log(`Recharge for ${name}`);

    const newBalance = +this.props.airtime + airtime;
    this.logger.log(`Account Balance ${newBalance}`);

    return `${newBalance}`;
  }
}
