import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service';
// import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
