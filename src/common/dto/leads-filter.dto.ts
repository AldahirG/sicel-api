import { IsOptional, IsUUID, IsString } from 'class-validator';

export class LeadsFilterDto {
  @IsOptional()
  @IsUUID()
  asetnameId?: string;

  @IsOptional()
  @IsUUID()
  careerId?: string;

  @IsOptional()
  @IsUUID()
  countryId?: string;

  @IsOptional()
  @IsUUID()
  cycleId?: string;

  @IsOptional()
  @IsUUID()
  gradeId?: string;

  @IsOptional()
  @IsUUID()
  cityId?: string;

  @IsOptional()
  @IsUUID()
  stateId?: string;

  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @IsOptional()
  @IsUUID()
  promoterId?: string; // Promotor filtrado por ID (UUID)

  @IsOptional()
  @IsString()
  followUp?: string; // Seguimiento por nombre

  @IsOptional()
  @IsString()
  medioContacto?: string; // Medio de contacto por nombre

  @IsOptional()
  @IsUUID()
  userId?: string; // Promotor filtrado por ID (UUID)

}
