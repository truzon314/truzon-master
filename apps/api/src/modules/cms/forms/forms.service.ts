import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateFormSubmissionDto, UpdateFormSubmissionDto, FormSubmissionQueryDto } from './dto/form.dto';
import { User, RoleType, Prisma } from '@prisma/client';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async submit(createFormSubmissionDto: CreateFormSubmissionDto, ipAddress?: string, userAgent?: string) {
    const submission = await this.prisma.formSubmission.create({
      data: {
        ...createFormSubmissionDto,
        ipAddress,
        userAgent,
      },
    });
    return { id: submission.id, status: submission.status };
  }

  async findAll(query: FormSubmissionQueryDto, currentUser: User) {
    const { page = 1, limit = 20, formKey, status, assignedUserId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.FormSubmissionWhereInput = {};
    if (formKey) where.formKey = formKey;
    if (status) where.status = status;
    if (assignedUserId) where.assignedUserId = assignedUserId;

    if (currentUser.roleId === 'SALES' || currentUser.roleId === 'CP') {
      where.assignedUserId = currentUser.id;
    }

    const [submissions, total] = await Promise.all([
      this.prisma.formSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { assignedUser: { select: { id: true, fullName: true } } },
      }),
      this.prisma.formSubmission.count({ where }),
    ]);

    return { data: submissions, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, currentUser: User) {
    const submission = await this.prisma.formSubmission.findUnique({
      where: { id },
      include: { assignedUser: { select: { id: true, fullName: true } } },
    });
    if (!submission) throw new NotFoundException('Form submission not found');

    if (currentUser.roleId === 'SALES' || currentUser.roleId === 'CP') {
      if (submission.assignedUserId !== currentUser.id) throw new ForbiddenException('Access denied');
    }
    return submission;
  }

  async update(id: string, updateFormSubmissionDto: UpdateFormSubmissionDto, currentUser: User) {
    const submission = await this.findById(id, currentUser);

    if (currentUser.roleId !== 'SUPER_ADMIN' && currentUser.roleId !== 'ADMIN' && currentUser.roleId !== 'MANAGER') {
      if (submission.assignedUserId !== currentUser.id) throw new ForbiddenException('Access denied');
    }

    return this.prisma.formSubmission.update({
      where: { id },
      data: updateFormSubmissionDto,
      include: { assignedUser: { select: { id: true, fullName: true } } },
    });
  }

  async export(query: FormSubmissionQueryDto, currentUser: User) {
    const { formKey, status, assignedUserId } = query;
    const where: Prisma.FormSubmissionWhereInput = {};
    if (formKey) where.formKey = formKey;
    if (status) where.status = status;
    if (assignedUserId) where.assignedUserId = assignedUserId;

    return this.prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { assignedUser: { select: { id: true, fullName: true } } },
    });
  }
}