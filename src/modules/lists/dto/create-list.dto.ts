import { IsString, IsDateString } from 'class-validator';

export class CreateListDto {
  @IsString()
  noLista: string;

  @IsDateString()
  dateStart: string;

  @IsDateString()
  dateEnd: string;
}
