import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AuthModule } from '../../../auth.module';
import { UserOrmEntity } from '../../../infrastructure/persistence/entities/user.orm-entity';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AuthModule,
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [UserOrmEntity],
                    synchronize: true,
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        const userRepository = app.get('UserRepositoryImpl');
        const ormRepository = app.get('UserOrmEntityRepository');
        await ormRepository.query('DELETE FROM users;');
    });


    it('/auth/register (POST) - should register a new user successfully', async () => {
        const registerDto = {
            email: 'e2e_newuser@example.com',
            password: 'StrongPassword123',
            username: 'e2e_newuser',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(201);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('email', registerDto.email);
        expect(typeof response.body.accessToken).toBe('string');
        expect(typeof response.body.userId).toBe('string');
    });

    it('/auth/register (POST) - should return 409 Conflict if email already exists', async () => {
        const registerDto = {
            email: 'e2e_existing@example.com',
            password: 'StrongPassword123',
        };

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(201);

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(409);

        expect(response.body.message).toBe(`User with email '${registerDto.email}' already exists.`);
    });

    it('/auth/login (POST) - should successfully log in an existing user', async () => {
        const registerDto = {
            email: 'e2e_loginuser@example.com',
            password: 'LoginPassword123',
        };

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(201);

        const loginDto = {
            email: 'e2e_loginuser@example.com',
            password: 'LoginPassword123',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('email', loginDto.email);
    });

    it('/auth/login (POST) - should return 401 Unauthorized for invalid credentials', async () => {
        const loginDto = {
            email: 'nonexistent@example.com',
            password: 'WrongPassword',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(401);

        expect(response.body.message).toBe('Invalid credentials');

        const registerDto = {
            email: 'e2e_user_for_wrong_pwd@example.com',
            password: 'CorrectPassword',
        };
        await request(app.getHttpServer()).post('/auth/register').send(registerDto).expect(201);

        const wrongPwdLoginDto = {
            email: 'e2e_user_for_wrong_pwd@example.com',
            password: 'WrongPassword',
        };
        await request(app.getHttpServer())
            .post('/auth/login')
            .send(wrongPwdLoginDto)
            .expect(401);
    });
});