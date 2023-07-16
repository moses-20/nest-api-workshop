import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RechargeAirtimeException } from '../account.exception';
import { Response } from 'express';

@Catch(RechargeAirtimeException)
export class RechargeAirtimeExceptionFilter implements ExceptionFilter {
  private logger = new Logger('RechargeAirtimeExceptionFilter');

  catch(exception: RechargeAirtimeException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    this.logger.log(exception.description);

    return response.status(exception.getStatus()).json({
      message: exception.message,
      error: exception.description,
      statusCode: exception.getStatus(),
    });
  }
}
