import { IsNumber, IsOptional, IsString, IsEnum, IsISO8601 } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from './create-expense.dto';

export class UpdateExpenseDto {
  /** Updated amount (optional) */
  @ApiPropertyOptional({ description: 'Updated amount (optional)', example: 120 })
  @IsNumber()
  @IsOptional()
  amount?: number;

  /** Updated note (optional) */
  @ApiPropertyOptional({ description: 'Updated note (optional)', example: 'Dinner with client' })
  @IsString()
  @IsOptional()
  note?: string;

  /** Updated category (optional) */
  @ApiPropertyOptional({
    description: 'Updated category (optional)',
    enum: Category,
    example: 'FOOD',
  })
  @IsEnum(Category)
  @IsOptional()
  category?: Category;

  /** Updated creation date (optional) */
  @ApiPropertyOptional({
    description: 'Updated creation date (ISO8601)',
    example: '2024-01-01T12:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  createdAt?: string;
}
