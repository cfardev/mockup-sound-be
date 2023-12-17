import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';
import { Role } from '@prisma/client'; // Add missing import

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService; // Add missing import

  beforeEach(async () => {
    prismaService = new PrismaService();
    jwtService = new JwtService();
    configService = new ConfigService();

    service = new AuthService(jwtService, configService, prismaService);
  });

  it('should register a new user', async () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prismaService.user, 'create').mockResolvedValue({
      id: 1,
      email: registerDto.email,
      role: Role.USER,
      firstName: registerDto.firstName, // Add missing property
      lastName: registerDto.lastName, // Add missing property
      photoUrl: '', // Add missing property
      password: '', // Add missing property
      createdAt: new Date(), // Add missing property
      updatedAt: new Date(), // Add missing property
    });

    const result = await service.register(registerDto);

    expect(result.user.email).toEqual(registerDto.email);
  });

  it('should throw an error if user already exists', async () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };

    await expect(service.register(registerDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should login a user', async () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
      id: 1,
      email: loginDto.email,
      password: await argon.hash(loginDto.password),
      role: Role.USER,
      firstName: '', // Add missing property
      lastName: '', // Add missing property
      photoUrl: '', // Add missing property
      createdAt: new Date(), // Add missing property
      updatedAt: new Date(), // Add missing property
    });

    const result = await service.login(loginDto);

    expect(result.user.email).toEqual(loginDto.email);
  });

  it('should throw an error if user not found', async () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw an error if password is incorrect', async () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
      id: 1,
      email: loginDto.email,
      password: await argon.hash('wrongpassword'),
      role: Role.USER,
      firstName: '', // Add missing property
      lastName: '', // Add missing property
      photoUrl: '', // Add missing property
      createdAt: new Date(), // Add missing property
      updatedAt: new Date(), // Add missing property
    });

    await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
  });
});
