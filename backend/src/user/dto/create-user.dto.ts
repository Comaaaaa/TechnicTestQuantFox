import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  /** Username for the new user */
  @ApiProperty({ description: 'Username for the new user', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  /** Password for the new user (min 5 chars) */
  @ApiProperty({
    description: 'Password for the new user (min 5 chars)',
    example: 'strongPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
