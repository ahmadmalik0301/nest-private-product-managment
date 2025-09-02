import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async login(createAuthDto: CreateAuthDto) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: createAuthDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isMatch = await argon.verify(user.password, createAuthDto.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signup(createAuthDto: CreateAuthDto) {
    const hash = await argon.hash(createAuthDto.password);
    const user = await this.prisma.user.create({
      data: {
        ...createAuthDto,
        password: hash,
      },
    });

    const { password, ...userWithoutPassword } = user;
    await this.emailQueue.add('sendEmail', {
      to: user.email,
      subject: 'Welcome to Our App!',
      text: 'Thank you for signing up, ' + user.name + '!',
    });
    console.log('Signup email job added to the queue');
    return {
      message: 'User signed up successfully',
      user: userWithoutPassword,
    };
  }

  async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '2h',
      secret,
    });
    return { token };
  }
}
