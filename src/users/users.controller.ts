import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(AuthGuard)
  @Get('userinfo')
  async getProfile(@Request() req) {
    const res = await this.usersService.getUser(req.user.user_id);
    console.log('usercontroller22', res);
    return res;
  }
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() signInDto: Record<string, any>,
    @Res() response: Response,
  ) {
    try {
      const res = await this.usersService.insertUser(signInDto);
      if (res.error) {
        // @ts-ignore
        return response.status(406).send(res);
      }
      // @ts-ignore
      else response.status(HttpStatus.OK).send(res);
    } catch (e) {
      throw e;
      //  console.log(e)
    }
  }
}
