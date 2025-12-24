import { IsDateString, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty({ message: 'El nombre del cupón es obligatorio' })
  name: string;
  @IsNotEmpty({ message: 'El descuento del cupón es obligatorio' })
  @IsInt({ message: 'El descuetno debe ser entre 1 y 100' })
  @Max(100, { message: 'El descuento máximo es 100' })
  @Min(1, { message: 'El descuento minimo es 1' })
  percentage: number;
  @IsNotEmpty({ message: 'La fecha del cupón es obligatorio' })
  @IsDateString({}, { message: 'Fecha no válida' })
  expirationDate: Date;
}
