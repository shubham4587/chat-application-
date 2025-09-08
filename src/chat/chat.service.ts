import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateRoom(roomName: string, username: string) {
    if (!roomName || !username) {
      throw new Error('roomName and username are required');
    }

    // find or create user
    let user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      user = await this.prisma.user.create({ data: { username } });
    }

    // find or create room
    let room = await this.prisma.room.findUnique({ where: { name: roomName } });
    if (!room) {
      room = await this.prisma.room.create({
        data: {
          name: roomName,
          users: { connect: { id: user.id } },
        },
      });
    } else {
      // connect user to existing room
      await this.prisma.room.update({
        where: { id: room.id },
        data: { users: { connect: { id: user.id } } },
      });
    }

    // return updated room with users
    return this.prisma.room.findUnique({
      where: { name: roomName },
      include: { users: true },
    });
  }

  async createMessage(roomName: string, username: string, content: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    const room = await this.prisma.room.findUnique({ where: { name: roomName } });

    if (!user || !room) {
      throw new Error('Invalid user or room');
    }

    return this.prisma.message.create({
      data: {
        content,
        senderId: user.id,
        roomId: room.id,
      },
      include: { sender: true, room: true },
    });
  }
}
