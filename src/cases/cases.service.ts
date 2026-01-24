import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { AuthenticatedUser } from '../auth/authenticated-user.type';
import { UserRole } from '../auth/roles.enum';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  // Assignment rules
  private canAssign(assignerRole: UserRole, targetRole: UserRole): boolean {
    if (assignerRole === UserRole.ADMIN) {
      return [UserRole.SUPERVISOR, UserRole.AGENT].includes(targetRole);
    }

    if (assignerRole === UserRole.SUPERVISOR) {
      return targetRole === UserRole.AGENT;
    }

    return false;
  }

  //Create Case
  async createCase(user: AuthenticatedUser, dto: CreateCaseDto) {
    const status = await this.prisma.caseStatus.findUnique({
      where: { name: 'TO_BE_REVIEWED' },
    });

    return this.prisma.case.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdBy: user.id,
        statusId: status!.id,
      },
    });
  }

  //Assign Case
  async assignCase(
    caseId: string,
    user: AuthenticatedUser,
    targetUserId: string,
  ) {
    // Check if case exists
    const existingCase = await this.prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      throw new NotFoundException('Case not found');
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: { role: true },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Check assignment permission
    if (
      !this.canAssign(
        user.role.name as UserRole,
        targetUser.role.name as UserRole,
      )
    ) {
      throw new ForbiddenException(
        'You are not allowed to assign to this user',
      );
    }

    // Perform the assignment
    return this.prisma.case.update({
      where: { id: caseId },
      data: {
        assignedTo: targetUser.id,
      },
    });
  }

  // Update Case Status
  async updateStatus(
    caseId: string,
    user: AuthenticatedUser,
    statusName: string,
  ) {
    // Check if case exists
    const existingCase = await this.prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      throw new NotFoundException('Case not found');
    }

    // Check if user is assigned to this case
    if (existingCase.assignedTo !== user.id) {
      throw new ForbiddenException('You can only update cases assigned to you');
    }

    // Get status
    const status = await this.prisma.caseStatus.findUnique({
      where: { name: statusName },
    });

    if (!status) {
      throw new BadRequestException('Invalid status');
    }

    // Update case status
    return this.prisma.case.update({
      where: { id: caseId },
      data: {
        statusId: status.id,
      },
    });
  }
}
