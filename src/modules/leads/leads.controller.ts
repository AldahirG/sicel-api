import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
    ParseUUIDPipe,
    UseInterceptors,
    UploadedFile,
    HttpException,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { Express } from 'express';
import { UpdatePromotorDto } from './dto/update-promotor.dto';
import { FilterLeadDto } from './dto/filter-lead.dto';
import { LeadsFilterDto } from '../../common/dto/leads-filter.dto';
import { SearchLeadsDto } from './dto/search-leads.dto';
@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) {}

    // Crear Lead
@UseGuards(JwtAuthGuard)
@Post()
create(@Body() dto: CreateLeadDto, @Req() req) {
  return this.leadsService.create(dto, req.user); // 👈 req.user contiene el usuario autenticado
}



      @UseGuards(JwtAuthGuard)  // Protege la ruta con el guard de JWT
  @Post('create-for-promoter')  // Endpoint para crear el lead por promotor
  createForPromoter(@Request() req, @Body() createLeadDto: CreateLeadDto) {
    // Aquí usamos el servicio createForPromoter, pasando el dto y el usuario logueado
    return this.leadsService.createForPromoter(createLeadDto, req.user);
  }

    // Buscar Lead por teléfono o nombre
    @Get('search-by-phone-or-name')
    @UseGuards(JwtAuthGuard)
    async searchByPhoneOrName(@Query() dto: SearchLeadsDto) {
      return this.leadsService.findLeadByPhoneOrName(dto.query);
    }

    @UseGuards(JwtAuthGuard)
    @Get('search-my-leads')
    async searchMyLeads(@Query('query') query: string, @Request() req) {
        // Validar que el parámetro query esté presente
        if (!query) {
            throw new HttpException(
                'El parámetro "query" es requerido',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Llamar al servicio para realizar la búsqueda
        return this.leadsService.findLeadByPhoneOrNameForUser(query, req.user);
    }

    // Obtener todos los leads con filtros opcionales
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query() params: FilterLeadDto) {
        if (params.followUp) params.followUp = decodeURIComponent(params.followUp);
        if (params.medioContacto) params.medioContacto = decodeURIComponent(params.medioContacto);

        return this.leadsService.findAll(params);
    }

    // Obtener todos los leads con filtros dinámicos
    @UseGuards(JwtAuthGuard)
    @Get('filtered')
    findAllWithDynamicFilters(@Query() params: LeadsFilterDto) {
        return this.leadsService.getFilteredLeads(params);
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-by-user')
    async getLeadsByUser(
        @Query() params: LeadsFilterDto,
        @Request() req,
    ) {
        const user = req.user;
        return this.leadsService.getFilteredLeadsByUser(params, user);
    }

    // Obtener un lead por su ID
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string, @Query() params: FilterLeadDto) {
        return this.leadsService.findOne(id, params);
    }

    // Actualizar un lead por su ID
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateLeadDto: UpdateLeadDto,
        @Request() req,
    ) {
        return this.leadsService.update(id, updateLeadDto, req.user);
    }

    // Eliminar un lead por su ID
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.leadsService.remove(id);
    }

    // Asignación de promotor a un lead
    @UseGuards(JwtAuthGuard)
    @Patch(':id/assignment/:userId')
    assignment(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('userId', ParseUUIDPipe) userId: string,
    ) {
        return this.leadsService.assignment(id, userId);
    }

    // Crear Leads desde archivo CSV
    @UseGuards(JwtAuthGuard)
    @Post('file-share')
    @UseInterceptors(FileInterceptor('file'))
    CreateFromFileShare(@UploadedFile() file: Express.Multer.File) {
        return this.leadsService.CreateFromFileShare(file);
    }

    // Actualizar promotor de múltiples leads
    @UseGuards(JwtAuthGuard)
    @Patch('muti-select/update-promotor')
    updatePromotor(@Body() data: UpdatePromotorDto) {
        return this.leadsService.updatePromotor(data);
    }

    // Obtener leads asignados a un promotor
    @UseGuards(JwtAuthGuard)
    @Get('get-by-user/:userId')
    getByUser(
        @Param('userId', ParseUUIDPipe) id: string,
        @Query() params: FilterLeadDto,
    ) {
        return this.leadsService.getByUser(id, params);
    }

    // Ruta para obtener los valores dinámicos de los filtros
    @UseGuards(JwtAuthGuard)
    @Get('filters/:filter')
    getFilterValues(@Param('filter') filter: string) {
        return this.leadsService.getFilterValues(filter);
    }
}
