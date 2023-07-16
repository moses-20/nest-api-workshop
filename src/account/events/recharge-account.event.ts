export class RechargeAccountEvent {
  constructor(
    public readonly account: string,
    public readonly beneficiary?: string,
  ) {}
}
