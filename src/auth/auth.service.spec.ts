import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    prismaService = new PrismaService();
    jwtService = new JwtService({ secret: 'test' });
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
      ...registerDto,
      id: 1,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      photoUrl: '', // Add the photoUrl property
    });
    jest.spyOn(service, 'signToken').mockResolvedValue('token');

    const result = await service.register(registerDto);

    expect(result).toEqual({
      token: 'token',
      user: {
        id: 1,
        email: registerDto.email,
        role: Role.USER,
        photoUrl: '', // Add the photoUrl property
      },
    });
  });

  it('should throw an error if user already exists', async () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
      ...registerDto,
      id: 1,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      photoUrl: '', // Add the photoUrl property
    });

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
      ...loginDto,
      id: 1,
      role: Role.USER,
      firstName: 'Test',
      lastName: 'User',
      photoUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    jest.spyOn(argon, 'verify').mockResolvedValue(true);
    jest.spyOn(service, 'signToken').mockResolvedValue('token');

    const result = await service.login(loginDto);

    expect(result).toEqual({
      token: 'token',
      user: {
        id: 1,
        email: loginDto.email,
        role: Role.USER,
        photoUrl: '', // Add the photoUrl property
      },
    });
  });

  it('should throw an error if login credentials are invalid', async () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
  });

  it('should login with Google and create/update user in the database', async () => {
    const req = {
      user: {
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        picture: '',
      },
    };

    jest.spyOn(prismaService.user, 'upsert').mockResolvedValue({
      ...req.user,
      id: 1,
      role: Role.USER,
      photoUrl: '',
      password: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    jest.spyOn(service, 'signToken').mockResolvedValue('token');

    const result = await service.googleLogin(req);

    expect(result).toEqual({
      token: 'token',
      user: {
        id: 1,
        email: req.user.email,
        photoUrl: req.user.picture,
        role: Role.USER,
      },
    });
  });
});
