import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer'; // Indispensable pour la conversion

// Définis proprement les types autorisés
export enum PropertyType {
  APPARTEMENT = 'appartement',
  MAISON = 'maison',
  VILLA = 'villa',
  STUDIO = 'studio',
  COMMERCIAL = 'commercial',
}

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number) // Convertit le texte "2500" en nombre 2500
  @IsNumber()
  @Min(0)
  prix: number;

  @IsEnum(PropertyType) // Utilise l'Enum définie plus haut
  type: string;

  @IsString()
  @IsOptional()
  adresse?: string;

  @Type(() => Number) // Conversion auto
  @IsNumber()
  @IsOptional()
  superficie?: number;

  @Type(() => Number) // Conversion auto
  @IsNumber()
  @IsOptional()
  nombrePieces?: number;
}
