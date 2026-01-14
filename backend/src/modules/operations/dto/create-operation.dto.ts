import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TypeOperation } from '../entities/operations.entity';
import { Type } from 'class-transformer';

class ClientInlineDto {
  @IsString() nom: string;
  @IsString() prenom: string;
  @IsString() email: string;
  @IsOptional() @IsString() telephone?: string;
}

export class CreateOperationDto {
  @IsEnum(TypeOperation)
  type: TypeOperation;

  @IsOptional()
  @IsNumber()
  montantFinal?: number;

  @IsNumber()
  proprieteId: number;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ClientInlineDto)
  client?: ClientInlineDto;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsOptional()
  contratClauses?: string;
}
