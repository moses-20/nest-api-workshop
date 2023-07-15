import { AggregateRoot } from '@nestjs/cqrs';

export interface AccountModelProps {
  id: number;
  name: string;
  sim: string;
  airtime: string;
  beneficiary?: AccountModelProps;
}

export class AccountModel extends AggregateRoot {
  constructor(readonly props: AccountModelProps) {
    super();
  }
}
