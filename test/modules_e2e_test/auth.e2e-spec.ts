import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService], // Add PrismaService as a provider
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Clear the database before running tests
    const prisma = app.get(PrismaService);
    await prisma.reset();
  });

  describe('POST /auth/register', () => {
    it('/auth/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'User',
          password: 'password',
        })
        .expect(201);
    });

    it('/auth/register (POST) - duplicate email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'User',
          password: 'password',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('/auth/login (POST) - invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testsds',
          password: 'password',
        })
        .expect(400)
        .timeout(3000);
    });

    it('/auth/login (POST) - invalid password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'randomPassword',
        })
        .expect(404)
        .timeout(3000);
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(201)
        .timeout(3000);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
