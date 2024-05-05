import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
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

        return response.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
        });
    }
}
