import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('agreements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Get()
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN)
  findAll(@Query('studentId') studentId?: string) {
    return this.agreementsService.findAll(studentId);
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PARENT, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.agreementsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateAgreementDto) {
    return this.agreementsService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.STUDENT, UserRole.PARENT)
  update(@Param('id') id: string, @Body() dto: UpdateAgreementDto) {
    return this.agreementsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.agreementsService.remove(id);
  }
}
