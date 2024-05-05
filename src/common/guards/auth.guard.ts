import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const accessToken = request.headers.authorization?.split(' ')[1];

        if (!accessToken) {
            return false;
        }

        const user = await prisma.user.findFirst({ where: { accessToken }, include: { roles: true } });

        console.log(user);

        if (!user || !user.status) {
            throw new HttpException('Unauthenticated', HttpStatus.UNAUTHORIZED)
        }

        const { password: ___, accessToken: token, ...rest } = user;

        request.user = rest;

        return true;
    }
}
