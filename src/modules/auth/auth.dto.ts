import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
}

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @IsAlphanumeric()
  password: string;
}

export class LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(12)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsAlphanumeric()
  password: string;
}
