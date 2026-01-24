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
import { CaseFilterDto, PaginatedResponse } from './dto/case-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  // Helper to check role
  private isRole(user: AuthenticatedUser, role: UserRole): boolean {
    return user.role.name === (role as string);
  }

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

  // Get All Cases (filtered by role)
  async findAll(
    user: AuthenticatedUser,
    filterDto: CaseFilterDto,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, status, search } = filterDto;
    const skip = (page - 1) * limit;

    // Base where clause with proper Prisma type
    const whereClause: Prisma.CaseWhereInput =
      this.isRole(user, UserRole.ADMIN) ||
      this.isRole(user, UserRole.SUPERVISOR)
        ? {}
        : { assignedTo: user.id };

    // Add status filter
    if (status) {
      const statusObj = await this.prisma.caseStatus.findUnique({
        where: { name: status },
      });
      if (statusObj) {
        whereClause.statusId = statusObj.id;
      }
    }

    // Add search filter (search in title and description)
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count with filters
    const total = await this.prisma.case.count({
      where: whereClause,
    });

    // Get paginated data with filters
    const data = await this.prisma.case.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { id: true, name: true, role: true },
        },
        assignedUser: {
          select: { id: true, name: true, role: true },
        },
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // Get All Case Statuses
  async getStatuses() {
    return this.prisma.caseStatus.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Get Case by ID
  async findOne(caseId: string, user: AuthenticatedUser) {
    const caseItem = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: {
        creator: {
          select: { id: true, name: true, role: true },
        },
        assignedUser: {
          select: { id: true, name: true, role: true },
        },
        status: true,
      },
    });

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    // Agent can only view cases assigned to them
    if (this.isRole(user, UserRole.AGENT) && caseItem.assignedTo !== user.id) {
      throw new ForbiddenException('You can only view cases assigned to you');
    }

    return caseItem;
  }

  // Get User Statistics
  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get all statuses
    const statuses = await this.prisma.caseStatus.findMany();

    // Count cases by status for this user
    const stats = await Promise.all(
      statuses.map(async (status) => {
        const count = await this.prisma.case.count({
          where: {
            assignedTo: userId,
            statusId: status.id,
          },
        });

        return {
          status: status.name,
          count,
        };
      }),
    );

    // Total cases assigned
    const totalAssigned = await this.prisma.case.count({
      where: { assignedTo: userId },
    });

    // Total cases created (if user is admin/supervisor)
    const totalCreated = await this.prisma.case.count({
      where: { createdBy: userId },
    });

    return {
      userId,
      userName: user.name,
      totalAssigned,
      totalCreated,
      byStatus: stats,
    };
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
