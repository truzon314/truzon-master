import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getRefreshTokenCookieName(): string {
    return this.configService.get<string>('jwt.refreshTokenCookieName', 'refresh_token');
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (registerDto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: registerDto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('User with this phone already exists');
      }
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    // Default to CLIENT role for self-registration
    const clientRole = await this.prisma.role.findUnique({
      where: { name: 'CLIENT' },
    });

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        phone: registerDto.phone,
        passwordHash,
        fullName: registerDto.fullName,
        role: clientRole ? { connect: { id: clientRole.id } } : undefined as any,
        status: 'PENDING_VERIFICATION',
      },
      include: {
        role: { include: { permissions: true } },
      },
    });

    // Create email verification token
    await this.createAuthToken(user.id, 'EMAIL_VERIFICATION');

    // TODO: Send verification email

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        role: { include: { permissions: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE' && user.status !== 'PENDING_VERIFICATION') {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: { increment: 1 },
          lockedUntil: user.failedLoginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts > 0) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto, ipAddress?: string, userAgent?: string) {
    const { refreshToken } = refreshTokenDto;

    // Find and validate refresh token
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: {
            role: { include: { permissions: true } },
          },
        },
      },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate refresh token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens(storedToken.user, ipAddress, userAgent);

    return {
      user: this.sanitizeUser(storedToken.user),
      ...tokens,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId },
        data: { revokedAt: new Date() },
      });
    } else {
      // Revoke all refresh tokens for user
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return { success: true };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true };
    }

    await this.createAuthToken(user.id, 'PASSWORD_RESET');

    // TODO: Send password reset email

    return { success: true };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    const authToken = await this.prisma.authToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!authToken || authToken.usedAt || authToken.expiresAt < new Date() || authToken.purpose !== 'PASSWORD_RESET') {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: authToken.userId },
        data: { passwordHash },
      }),
      this.prisma.authToken.update({
        where: { id: authToken.id },
        data: { usedAt: new Date() },
      }),
      // Revoke all refresh tokens to force re-login
      this.prisma.refreshToken.updateMany({
        where: { userId: authToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { success: true };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    const authToken = await this.prisma.authToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!authToken || authToken.usedAt || authToken.expiresAt < new Date() || authToken.purpose !== 'EMAIL_VERIFICATION') {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: authToken.userId },
        data: { emailVerified: true, status: 'ACTIVE' },
      }),
      this.prisma.authToken.update({
        where: { id: authToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { success: true };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.emailVerified) {
      return { success: true };
    }

    await this.createAuthToken(user.id, 'EMAIL_VERIFICATION');

    // TODO: Send verification email

    return { success: true };
  }

  private async generateTokens(user: any, ipAddress?: string, userAgent?: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
      permissions: user.role?.permissions?.map((p: any) => p.key) || [],
    };

    const accessToken = this.jwtService.sign(payload);

    // Create refresh token
    const refreshToken = uuidv4();
    const refreshExpiry = this.configService.get<string>('jwt.refreshTokenExpiry', '7d');
    const expiresAt = new Date(Date.now() + this.parseExpiry(refreshExpiry));

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        deviceInfo: userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  private async createAuthToken(userId: string, purpose: string) {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.authToken.create({
      data: {
        token,
        userId,
        purpose,
        expiresAt,
      },
    });

    return token;
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }

  private sanitizeUser(user: any) {
    const { passwordHash, twoFactorSecret, refreshTokens, authTokens, ...sanitized } = user;
    return sanitized;
  }
}