import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class RechargeAirtimeException extends HttpException {
  public description: string;
}

export class InvalidAirtimeException extends RechargeAirtimeException {
  constructor(code: string) {
    super(`Airtime with code ${code} is not valid`, HttpStatus.BAD_REQUEST, {
      cause: new Error('Invalid Airtime Code'),
    });

    this.description = `The airtime code ${code} is neither valid nor usable`;
  }

  description: string;
}

export class AccountNotFoundException extends RechargeAirtimeException {
  constructor(sim: string) {
    super(`Subscriber ${sim} does not exist`, HttpStatus.BAD_REQUEST, {
      cause: new Error('Invalid Airtime Code'),
    });

    this.description = `Subscriber ${sim} does not exist or has been deactivated`;
  }

  description: string;
}
