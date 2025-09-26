import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import BadRequestError from '../../errors/custom/bad.request.error.class';
import UnauthorizedError from '../../errors/custom/unauthorized.error.class';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// Mock external modules
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserService: jest.Mocked<UserService>;
  beforeEach(() => {
    // Create a mocked UserService
    mockUserService = {
      createUser: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    authService = new AuthService(mockUserService);
  });

  describe('register', () => {
    it('should call userService.createUser', async () => {
      const dto = { email: 'a@test.com', password: '123' } as any;
      mockUserService.createUser.mockResolvedValue({ id: 1, ...dto });

      const result = await authService.register(dto);

      expect(mockUserService.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('authenticate', () => {
    it('should throw if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.authenticate({ email: 'x', password: '123' } as any)
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw if password mismatch', async () => {
      mockUserService.findByEmail.mockResolvedValueOnce({
        id: 1,
        name: 'y',
        email: 'x',
        password: 'hashed',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.authenticate({ email: 'x', password: 'wrong' } as any)
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should return token if password correct', async () => {
      mockUserService.findByEmail.mockResolvedValueOnce({
        id: 1,
        name: 'y',
        email: 'x',
        password: 'hashed',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('signed-token');

      const token = await authService.authenticate({
        email: 'x',
        password: '123',
      } as any);

      expect(token).toBe('signed-token');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, role: 'USER' },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
    });
  });

  describe('changePassword', () => {
    it('should throw if user does not exist', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(
        authService.changePassword(
          { oldPassword: 'old', newPassword: 'new' } as any,
          1
        )
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw if old password is wrong', async () => {
      mockUserService.findById.mockResolvedValue({
        id: 1,
        password: 'hashed',
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.changePassword(
          { oldPassword: 'wrong', newPassword: 'new' } as any,
          1
        )
      ).rejects.toThrow(BadRequestError);
    });

    it('should call update if old password is correct', async () => {
      mockUserService.findById.mockResolvedValue({
        id: 1,
        password: 'hashed',
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await authService.changePassword(
        { oldPassword: 'correct', newPassword: 'new' } as any,
        1
      );

      expect(mockUserService.update).toHaveBeenCalledWith(
        { password: 'new' },
        1
      );
    });
  });
});
