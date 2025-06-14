import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: JwtService) { }

    async generateAccessToken(userId: string, email: string): Promise<string> {
        const payload = { sub: userId, email };
        return this.jwtService.sign(payload);
    }

    async verifyAccessToken(token: string): Promise<any> {
        return this.jwtService.verify(token);
    }
}