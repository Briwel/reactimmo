import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { TypePropriete } from '../entities/propriete.entity';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  prix: number;

  @IsEnum(TypePropriete)
  type: TypePropriete;

  @IsString()
  @IsOptional()
  adresse?: string;

  @IsNumber()
  @IsOptional()
  superficie?: number;

  @IsNumber()
  @IsOptional()
  nombrePieces?: number;
}
