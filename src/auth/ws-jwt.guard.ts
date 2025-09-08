// // ws-jwt.guard.ts
// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Socket } from 'socket.io';
// import { WsException } from '@nestjs/websockets';

// @Injectable()
// export class WsJwtGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   canActivate(context: ExecutionContext): boolean {
//     const client: Socket = context.switchToWs().getClient<Socket>();

//     // Support both auth and query token
//     const token =
//       client.handshake.auth?.token ||client.handshake.query?.token as string|undefined ;

//     if (!token) {
//       client.emit('error', { message: 'Unauthorized: Token missing' });
//       throw new WsException('Unauthorized: Token missing');
//     }

//     try {
//       const payload = this.jwtService.verify(token);
//       // Attach user payload to socket so gateway can use it
//       (client as any).user = payload;
//       return true;
//     } catch (err) {
//       client.emit('error', { message: 'Unauthorized: Invalid token' });
//       throw new WsException('Unauthorized: Invalid token');
//     }
//   }
// }




// // ws-jwt.guard.ts
// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Socket } from 'socket.io';

// @Injectable()
// export class WsJwtGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   canActivate(context: ExecutionContext): boolean {
//     const client: Socket = context.switchToWs().getClient<Socket>();
//     const token = client.handshake.auth?.token;

//     if (!token) {
//       client.emit('error', { message: 'Unauthorized: Token missing' });
//       throw new UnauthorizedException('Token missing');
//     }

//     try {
//       const payload = this.jwtService.verify(token);
//       (client as any).user = payload; // attach user to socket
//       return true;
//     } catch (err) {
//       client.emit('error', { message: 'Unauthorized: Invalid token' });
//       throw new UnauthorizedException('Invalid token');
//     }
//   }
// }




// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Socket } from 'socket.io';

// @Injectable()
// export class WsJwtGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const client: Socket = context.switchToWs().getClient<Socket>();
//     const token =
//       client.handshake.auth?.token || client.handshake.headers['authorization'];

//     if (!token) {
//       throw new UnauthorizedException('Missing auth token');
//     }

//     try {
      
//       const cleanToken = token.startsWith('Bearer ')
//         ? token.slice(7)
//         : token;

//       const payload = await this.jwtService.verifyAsync(cleanToken, {
//         secret: process.env.JWT_SECRET,
//       });

      
//       (client as any).user = payload;

//       return true;
//     } catch (err) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//   }
// }
