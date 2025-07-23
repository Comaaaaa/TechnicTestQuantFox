import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  /** Username for login */
  @ApiProperty({ description: 'Username for login', example: 'john_doe' })
  username: string;

  /** Password for login */
  @ApiProperty({ description: 'Password for login', example: 'strongPassword123' })
  password: string;
}
