import { IsDateString, IsNumberString, IsOptional } from 'class-validator';
export class GetTransactionQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad debe ser un número' })
  take: number;

  @IsOptional()
  @IsNumberString({}, { message: 'La página debe ser un número' })
  page: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha no es válida' })
  date: string;
}
