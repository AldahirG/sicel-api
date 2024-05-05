import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { IJwt } from './interfaces/jwt.interface';
import { TransformResponse } from 'src/common/mappers/transform-response';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly validTokens: Set<string> = new Set();

  async onModuleInit() {
    await this.$connect();
  }

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async signJWT(payload: IJwt) {
    return this.jwtService.sign(payload);
  }

  async login(payload: LoginDTO) {
    const { email, password } = payload
    const user = await this.user.findFirst({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      throw new HttpException(`Invalid credentials`, HttpStatus.BAD_REQUEST);
    }

    //! En caso de no tener le genera un token
    if (!user.accessToken) {
      user.accessToken = await this.signJWT({
        email: user.email,
        name: user.name,
        id: user.id,
      })

      await this.user.update({
        where: {
          id: user.id,
        },
        data: {
          accessToken: user.accessToken,
        }
      });
    }

    const { password: ___, accessToken: token, ...rest } = user;

    return TransformResponse.map({
      ...rest,
      token
    }, '', 'POST');
  }

  async logout(token: string) {
    const user = await this.user.findFirst({
      where: { accessToken: token }
    })

    await this.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: null,
      },
    });

    return TransformResponse.map({}, 'Session successfully closed', 'POST')
  }
}
