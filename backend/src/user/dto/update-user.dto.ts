import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  /** New username (optional) */
  @ApiPropertyOptional({ description: 'New username (optional)', example: 'john_doe_updated' })
  @IsString()
  @IsOptional()
  username?: string;

  /** Current password (required when changing password) */
  @ApiPropertyOptional({
    description: 'Current password (required when changing password)',
    example: 'currentPassword123',
  })
  @IsString()
  @IsOptional()
  currentPassword?: string;

  /** New password (optional, min 5 chars) */
  @ApiPropertyOptional({
    description: 'New password (optional, min 5 chars)',
    example: 'newStrongPassword123',
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  password?: string;
}
