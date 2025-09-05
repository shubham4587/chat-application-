import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JoinRoomDto } from './dto/join-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { GetMessagesDto } from './dto/get-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Join Room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: JoinRoomDto) {
    client.join(payload.roomId);

    // Notify everyone including sender
    this.server.in(payload.roomId).emit('userJoined', {
      userId: payload.userId,
      room: payload.roomId,
    });
  }

  // Send Message
  @SubscribeMessage('sendMessage')
  async handleMessage(client:Socket, payload: SendMessageDto) {
    const message = await this.chatService.saveMessage(
      payload.roomId,
      payload.senderId,
      payload.text,
    );

    // Emit to everyone including sender
    this.server.in(payload.roomId).emit('newMessage', message);
  }

  // Get Messages
  @SubscribeMessage('getMessages')
  async handleGetMessages(client: Socket, payload: GetMessagesDto) {
    const messages = await this.chatService.getMessages(payload.roomId);

    // Send messages only to requesting client
    client.emit('messageHistory', messages);
  }
}
