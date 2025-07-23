import { IsNumber, IsOptional, IsString, IsEnum, IsISO8601 } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Category {
  FOOD = 'FOOD',
  TRAVEL = 'TRAVEL',
  OFFICE = 'OFFICE',
  SHOPPING = 'SHOPPING',
  INVESTMENTS = 'INVESTMENTS',
  OTHER = 'OTHER',
}

export class CreateExpenseDto {
  /** Amount of the expense */
  @ApiProperty({ description: 'Amount of the expense', example: 100 })
  @IsNumber()
  amount: number;

  /** Optional note for the expense */
  @ApiPropertyOptional({
    description: 'Optional note for the expense',
    example: 'Lunch with client',
  })
  @IsString()
  @IsOptional()
  note?: string;

  /** Category of the expense (must be one of: FOOD, TRAVEL, OFFICE, SHOPPING, INVESTMENTS, OTHER) */
  @ApiProperty({ description: 'Category of the expense', enum: Category, example: 'FOOD' })
  @IsEnum(Category)
  category: Category;

  /** Optional creation date (ISO8601 string, defaults to now if not provided) */
  @ApiPropertyOptional({
    description: 'Creation date of the expense (ISO8601)',
    example: '2024-01-01T12:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  createdAt?: string;
}
