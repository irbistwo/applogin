import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email, pass) {
    const user = await this.usersService.findOne(email, pass);
    if (!user.is_valid) {
      throw new UnauthorizedException();
    }
    const payload = { user_id: user.id, username: user.username };
    return {
      //   access_token: await this.jwtService.signAsync(payload,{ expiresIn: '1h' }),
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1m',
      }),
    };
  }
}
