import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserRequestDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(30, { message: 'Password must not exceed 30 characters' })
    password: string;

    @IsString({ message: 'Username must be a string' })
    @IsOptional()
    username?: string;
}