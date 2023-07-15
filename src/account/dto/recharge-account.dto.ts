import { IsNumberString } from 'class-validator';

export class RechargeAccountDto {
  @IsNumberString()
  code: string;
}
