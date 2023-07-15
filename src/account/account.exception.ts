import { HttpException, HttpStatus } from '@nestjs/common';

export class NoBeneficiaryException extends HttpException {
  constructor(subscriber: string) {
    super(
      `No beneficiary found for subscriber ${subscriber}`,
      HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      {
        cause: new Error('Unidentified beneficiary'),
        description: `Subscriber ${subscriber} does not have a beneficiary or the beneficiary ID does not exist`,
      },
    );

    this.description = `Subscriber ${subscriber} does not have a beneficiary or the beneficiary ID does not exist`;
  }

  description: string;
}
