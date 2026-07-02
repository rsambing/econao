import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

const USER_ROLES = ['ADMIN', 'USER'];
const DEFAULT_ROLE = 'USER';
const SELECT_SAFE_USER = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true
};

export class UserService {
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async createUser(data) {
    const normalizedEmail = data.email?.toLowerCase?.();
    const existingUser = await this.getUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const role = USER_ROLES.includes(data.role) ? data.role : DEFAULT_ROLE;
    const password = await this.hashPassword(data.password);

    return await prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        password,
        role
      },
      select: SELECT_SAFE_USER
    });
  }

  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: SELECT_SAFE_USER
    });
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      select: SELECT_SAFE_USER
    });
  }

  async updateUser(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email.toLowerCase();
    if (data.password !== undefined) {
      updateData.password = await this.hashPassword(data.password);
    }
    if (data.role !== undefined) {
      if (!USER_ROLES.includes(data.role)) {
        throw new Error('Role inválido');
      }
      updateData.role = data.role;
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: SELECT_SAFE_USER
    });
  }

  async deleteUser(id) {
    return await prisma.user.delete({ where: { id } });
  }

  async getUserByEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email inválido');
    }

    return await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }
}