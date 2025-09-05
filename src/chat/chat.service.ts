import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Save a message and return it
  async saveMessage(roomId: string, senderId: string, text: string) {
    const message = await this.prisma.message.create({
      data: {
        text,
        senderId,
        roomId,
      },
      include: { sender: true }, // include sender info
    });

    return message;
  }

  // Get all messages of a room in ascending order
  async getMessages(roomId: string) {
    return this.prisma.message.findMany({
      where: { roomId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
