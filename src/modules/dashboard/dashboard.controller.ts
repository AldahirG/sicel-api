import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { TransformResponse } from 'src/common/mappers/transform-response';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Endpoints para el administrador
  @Get('status')
  async getTotalByStatus() {
    const data = await this.dashboardService.getTotalByStatus();
    return TransformResponse.map(data, 'Datos de status obtenidos con éxito');
  }

  @Get('cycle')
  async getTotalByCycle() {
    const data = await this.dashboardService.getTotalByCycle();
    return TransformResponse.map(data, 'Datos de ciclo obtenidos con éxito');
  }

  @Get('school-type')
  async getTotalBySchoolType() {
    const data = await this.dashboardService.getTotalBySchoolType();
    return TransformResponse.map(data, 'Datos de tipo de escuela obtenidos con éxito');
  }

  @Get('scholarship')
  async getTotalByScholarship() {
    const data = await this.dashboardService.getTotalByScholarship();
    return TransformResponse.map(data, 'Datos de becas obtenidos con éxito');
  }

  @Get('country')
  async getTotalByCountry() {
    const data = await this.dashboardService.getTotalByCountry();
    return TransformResponse.map(data, 'Datos por país obtenidos con éxito');
  }

  @Get('state')
  async getTotalByState() {
    const data = await this.dashboardService.getTotalByState();
    return TransformResponse.map(data, 'Datos por estado obtenidos con éxito');
  }

  @Get('city')
  async getTotalByCity() {
    const data = await this.dashboardService.getTotalByCity();
    return TransformResponse.map(data, 'Datos por ciudad obtenidos con éxito');
  }

  @Get('grade')
  async getTotalByGrade() {
    const data = await this.dashboardService.getTotalByGrade();
    return TransformResponse.map(data, 'Datos de grados académicos obtenidos con éxito');
  }

  @Get('semester')
  async getTotalBySemester() {
    const data = await this.dashboardService.getTotalBySemester();
    return TransformResponse.map(data, 'Datos por semestre obtenidos con éxito');
  }

  @Get('reference-type')
  async getTotalByReferenceType() {
    const data = await this.dashboardService.getTotalByReferenceType();
    return TransformResponse.map(data, 'Datos de tipos de referidos obtenidos con éxito');
  }

  @Get('campaign')
  async getTotalByCampaign() {
    const data = await this.dashboardService.getTotalByCampaign();
    return TransformResponse.map(data, 'Datos de campañas obtenidos con éxito');
  }

  @Get('contact-medium')
  async getTotalByContactMedium() {
    const data = await this.dashboardService.getTotalByContactMedium();
    return TransformResponse.map(data, 'Datos por medio de contacto obtenidos con éxito');
  }

  // Endpoints para el promotor (filtrados por usuario autenticado)
  @Get('promoter/status')
  async getPromoterTotalByStatus(@Request() req) {
    const userId = req.user.id; // Usuario autenticado
    const data = await this.dashboardService.getPromoterTotalByStatus(userId);
    return TransformResponse.map(data, 'Datos de status obtenidos con éxito');
  }

  @Get('promoter/cycle')
  async getPromoterTotalByCycle(@Request() req) {
    const userId = req.user.id;
    const data = await this.dashboardService.getPromoterTotalByCycle(userId);
    return TransformResponse.map(data, 'Datos de ciclo obtenidos con éxito');
  }

  @Get('promoter/city')
  async getPromoterTotalByCity(@Request() req) {
    const userId = req.user.id;
    const data = await this.dashboardService.getPromoterTotalByCity(userId);
    return TransformResponse.map(data, 'Datos de ciudad obtenidos con éxito');
  }

  @Get('promoter/contact-type')
  async getPromoterTotalByContactType(@Request() req) {
    const userId = req.user.id;
    const data = await this.dashboardService.getPromoterTotalByContactType(userId);
    return TransformResponse.map(data, 'Datos de medio de contacto obtenidos con éxito');
  }

  @Get('promoter/school-type')
  async getPromoterTotalBySchoolType(@Request() req) {
    const userId = req.user.id;
    const data = await this.dashboardService.getPromoterTotalBySchoolType(userId);
    return TransformResponse.map(data, 'Datos de tipo de escuela obtenidos con éxito');
  }

  @Get('promoter/program')
  async getPromoterTotalByProgram(@Request() req) {
    const userId = req.user.id;
    const data = await this.dashboardService.getPromoterTotalByProgram(userId);
    return TransformResponse.map(data, 'Datos de programa obtenidos con éxito');
  }

  @Get('promoter/semester')
  async getPromoterTotalBySemester(@Request() req) {
    const userId = req.user.id;
    const data = await this.dashboardService.getPromoterTotalBySemester(userId);
    return TransformResponse.map(data, 'Datos de semestre obtenidos con éxito');
  }

  @Get('promoter/campaign')
  async getPromoterTotalByCampaign(@Request() req) {
    const userId = req.user.id;
    const data = await this.dashboardService.getPromoterTotalByCampaign(userId);
    return TransformResponse.map(data, 'Datos de campaña obtenidos con éxito');
  }

  @Get('promoter/scholarship')
async getPromoterTotalByScholarship(@Request() req) {
  const userId = req.user.id; // Usuario autenticado
  const data = await this.dashboardService.getPromoterTotalByScholarship(userId);
  return TransformResponse.map(data, 'Datos de becas obtenidos con éxito');
}

@Get('promoter/followup')
async getPromoterTotalByFollowUp(@Request() req) {
  const userId = req.user.id; // Usuario autenticado
  const data = await this.dashboardService.getPromoterTotalByFollowUp(userId);
  return TransformResponse.map(data, 'Datos de seguimiento obtenidos con éxito');
}


}
