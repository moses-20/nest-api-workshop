import {
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

    this.logger.log('SIM QUERY IS: ', simQuery);

    if (simQuery == null) {
      //   throw new Error('SIM is not in query');
      return false;
    }

    return true;
  }
}
