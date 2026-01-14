import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

// On définit les types pour la validation IsEnum
export enum PropertyType {
  APPARTEMENT = 'appartement',
  MAISON = 'maison',
  VILLA = 'villa',
  STUDIO = 'studio',
  COMMERCIAL = 'commercial',
}

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est obligatoire' })
  titre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prix: number;

  @IsEnum(PropertyType, { message: 'Type de bien invalide' })
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  adresse: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  superficie?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nombrePieces?: number;

  @IsOptional()
  @IsString()
  contratClauses?: string;

  @IsOptional()
  @IsString()
  proprietaireId?: string;
}
