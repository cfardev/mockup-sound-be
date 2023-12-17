import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto): Promise<GrantedAccessResponse> {
    const { email, password, firstName, lastName, photoUrl } = registerDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await argon.hash(password);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        photoUrl,
      },
    });

    const token = await this.signToken(newUser.id, newUser.email, newUser.role);

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async login(login: LoginDto): Promise<GrantedAccessResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: login.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const passwordValid = await argon.verify(user.password, login.password);

    if (!passwordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    const token = await this.signToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async signToken(
    userId: number,
    email: string,
    role: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRATION'),
      secret: secret,
    });

    return token;
  }
}

export interface GrantedAccessResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}
