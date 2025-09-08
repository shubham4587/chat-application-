import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
// import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,  
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, PrismaService, ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
