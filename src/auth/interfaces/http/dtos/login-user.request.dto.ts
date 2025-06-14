import { IsEmail, IsString } from 'class-validator';

export class LoginUserRequestDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    password: string;
}