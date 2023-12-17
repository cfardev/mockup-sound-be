import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should call AuthService login', async () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password',
    };

    await authController.login(loginDto);

    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });

  it('should call AuthService register', async () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
    };

    await authController.register(registerDto);

    expect(authService.register).toHaveBeenCalledWith(registerDto);
  });
});
