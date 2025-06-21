import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PaginationFilterDto } from 'src/common/dto/pagination-filter.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // Admin Endpoints


    @UseGuards(JwtAuthGuard)
     @Get('export-excel')
     exportExcel(@Res() res: Response) {
       return this.enrollmentsService.exportToExcel(res);
     }

     @UseGuards(JwtAuthGuard)
   @Get('export-excel/list/:listId')
   exportExcelByList(
     @Param('listId', ParseUUIDPipe) listId: string,
     @Res() res: Response,
   ) {
     return this.enrollmentsService.exportToExcelByList(res, listId);
   }



  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() params: PaginationFilterDto) {
    return this.enrollmentsService.findAll(params);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentsService.remove(id);
  }

  // User Endpoints

  @UseGuards(JwtAuthGuard)
  @Get('user/list')
  findAllByUser(@Req() req: Request, @Query() params: PaginationFilterDto) {
    const user = req['user'] as { id: string }; // Ensure the user object has an id property
    return this.enrollmentsService.findAllByUser(user.id, params);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findOneByUser(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const user = req['user'] as { id: string }; // Ensure the user object has an id property
    return this.enrollmentsService.findOneByUser(user.id, id);
  }


}
