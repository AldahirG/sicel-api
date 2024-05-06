import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientErrorFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        if (exception.code === 'P2002') {
            return response.status(400).json({
                statusCode: 400,
                message: 'The value you enter is already registered.',
            });
        }

        if (exception.code === 'P2003') {
            return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                message: 'The value you are trying to assign does not exist in the referenced table.',
            });
        }

        return response.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
}
