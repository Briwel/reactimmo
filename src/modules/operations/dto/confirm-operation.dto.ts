import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TypeOperation } from '../entities/operations.entity';

export class ConfirmOperationDto {
  @IsOptional()
  @IsEnum(TypeOperation)
  typeOperation?: TypeOperation;

  @IsOptional()
  @IsNumber()
  montantFinal?: number;
}

