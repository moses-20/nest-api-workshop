import { IsNumberString } from 'class-validator';

export class AddBeneficiaryDto {
  @IsNumberString()
  beneficiaryId: string;
}
