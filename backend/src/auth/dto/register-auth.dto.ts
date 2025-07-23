import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
  /** Username for registration */
  @ApiProperty({ description: 'Username for registration', example: 'john_doe' })
  username: string;

  /** Password for registration (min 5 chars) */
  @ApiProperty({
    description: 'Password for registration (min 5 chars)',
    example: 'strongPassword123',
  })
  password: string;
}
