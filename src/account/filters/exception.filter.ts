import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { NoBeneficiaryException } from '../account.exception';
import { Response } from 'express';

@Catch(NoBeneficiaryException)
export class NoBeneficiaryExceptionFilter implements ExceptionFilter {
  private logger = new Logger('NoBeneficiaryExceptionFilter');

  catch(exception: NoBeneficiaryException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    this.logger.log(exception.description);

    return response.status(exception.getStatus()).json({
      message: exception.message,
      error: exception.description,
      statusCode: exception.getStatus(),
    });
  }
}
