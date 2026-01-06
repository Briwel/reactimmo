import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TypeOperation } from '../entities/operations.entity';

export class CreateOperationDto {
  @IsEnum(TypeOperation)
  type: TypeOperation;

  @IsNumber()
  montantFinal: number;

  @IsNumber()
  proprieteId: number;

  @IsNumber()
  clientId: number;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsOptional()
  contratClauses?: string;
}
