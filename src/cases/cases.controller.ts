import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { AssignCaseDto } from './dto/assign-case.dto';
import { UserRole } from '../auth/roles.enum';
import { Roles } from '../auth/roles.decorator';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CaseFilterDto } from './dto/case-filter.dto';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  create(@Req() req: Request, @Body() dto: CreateCaseDto) {
    return this.casesService.createCase(req.user!, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Query() filterDto: CaseFilterDto) {
    return this.casesService.findAll(req.user!, filterDto);
  }

  @Get('statuses') // ← HARUS SEBELUM :id
  getStatuses() {
    return this.casesService.getStatuses();
  }
  @Get('stats/:userId')
  getUserStats(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.casesService.getUserStats(userId);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.casesService.findOne(id, req.user!);
  }

  @Patch(':id/assign')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  assign(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignCaseDto,
  ) {
    return this.casesService.assignCase(id, req.user!, dto.userId);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPERVISOR, UserRole.AGENT)
  updateStatus(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.casesService.updateStatus(id, req.user!, dto.status);
  }
}
