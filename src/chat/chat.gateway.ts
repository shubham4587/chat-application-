import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
// import { WsJwtGuard } from 'src/auth/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Token checking for join room
    // const token = client.handshake.auth?.token;
    // if (!token) {
    //   client.emit('error', { message: 'Unauthorized: Token missing' });
    //   throw new UnauthorizedException('Token missing');
    // }

    if (!data?.room || !data?.username) {
      client.emit('error', {
        message: 'room and username are required',
      });
      return;
    }

    const room = await this.chatService.findOrCreateRoom(
      data.room,
      data.username,
    );

    client.join(room!.name);

    // Notify everyone in room
    this.server.to(room!.name).emit('roomJoined', {
      message: `${data.username} joined ${room!.name}`,
    });

    // Acknowledge to the user
    client.emit('joinedRoom', {
      room: room!.name,
      username: data.username,
    });
  }

  // @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { room: string; username: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    //  Token checking
    const token = client.handshake.auth?.token;
    if (!token) {
      client.emit('error', { message: 'Unauthorized: Token missing' });
      throw new UnauthorizedException('Token missing');
    }

    if (!data.room || !data.username || !data.content) {
      client.emit('error', {
        message: 'room, username, and content are required',
      });
      return;
    }

    const msg = await this.chatService.createMessage(
      data.room,
      data.username,
      data.content,
    );

    this.server.to(data.room).emit('newMessage', msg);
  }
}






// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { ChatService } from './chat.service';
// import { UseGuards } from '@nestjs/common';
// import { WsJwtGuard } from 'src/auth/ws-jwt.guard';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server;

//   constructor(private readonly chatService: ChatService) {}
// @UseGuards(WsJwtGuard)
//   @SubscribeMessage('joinRoom')
//   async handleJoinRoom(
//     @MessageBody() data: { room: string; username: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     if (!data?.room || !data?.username) {
//       console.log(data.room, data.username)
//       client.emit('error', {
//         message: 'room and username are required',
//       });
//       return;
//     }

//     const room = await this.chatService.findOrCreateRoom(
//       data.room,
//       data.username,
//     );

//     client.join(room!.name);

//     // Notify everyone in room
//     this.server.to(room!.name).emit('roomJoined', {
//       message: `${data.username} joined ${room!.name}`,
//     });

//     // Acknowledge to the user
//     client.emit('joinedRoom', {
//       room: room!.name,
//       username: data.username,
//     });
//   }

//   @UseGuards(WsJwtGuard)
//   @SubscribeMessage('sendMessage')
//   async handleMessage(
//     @MessageBody()
//     data: { room: string; username: string; content: string }) {
//     if (!data.room || !data.username || !data.content) {
//       console.log("not get both username and room")
      
//     }
//     console.log(data.room,data.content,data.username)
//     const msg = await this.chatService.createMessage(
//       data.room,
//       data.username,
//       data.content,
//     );
//     console.log('sending to room:', data.room, 'message:', msg);

//       this.server.to(data.room).emit('newMessage', msg);
      
//   }
// }
