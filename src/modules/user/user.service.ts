import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../auth/password.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private nullifyKeys<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): User {
    return keys.reduce((acc, key) => ({ ...acc, [key]: null }), user);
  }

  async findAll(): Promise<User[]> {
    const systemId = this.configService.get('SYSTEM_USER_ID');
    return await this.prisma.user.findMany({
      where: { NOT: { id: systemId } },
    });
  }

  async getUserInfoExcludingKeys(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    excludeKeys: (keyof User)[],
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    return this.nullifyKeys(user, excludeKeys);
  }

  async getUserByUniqueKey(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findUsersByParams(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }
}
