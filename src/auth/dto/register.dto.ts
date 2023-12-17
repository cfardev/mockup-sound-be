import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'jhondoe@gmail.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'The first name of the user',
    example: 'Jhon',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'The photo url of the user (S3, Cloudinary, etc)',
    example: 'https://cloudinary.com/jhondoe.jpg',
    required: false,
  })
  photoUrl?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '123d56d3',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
