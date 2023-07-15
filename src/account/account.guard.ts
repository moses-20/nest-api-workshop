import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AccountBalanceGuard implements CanActivate {
  private logger = new Logger('AccountBalanceGuard');

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const simQuery = request.query.sim as string;

    this.logger.log(`SIM QUERY IS: ${simQuery}`);

    if (simQuery == null || simQuery == '') {
      throw new BadRequestException("'sim' query is missing");
    }

    return true;
  }
}

@Injectable()
export class AccountParamGuard implements CanActivate {
  private logger = new Logger('AccountParam');

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const simParam = request.params.sim as string;

    this.logger.log(`SIM PARAMETER IS ${simParam}`);

    if (simParam == null || simParam == '') {
      throw new BadRequestException("'sim' parameter is missing");
    }

    return true;
  }
}
