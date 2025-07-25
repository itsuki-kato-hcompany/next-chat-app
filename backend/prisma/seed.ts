import { PrismaClient } from '@prisma/client';
import { seedChannelRoles } from './seed/channel-role.seed';
import { seedUsers } from './seed/user.seed';
import { seedChannels } from './seed/channel.seed';
import { seedMessages } from './seed/message.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  try {
    // 既存のデータを削除（開発環境のみ）
    console.log('🗑️  Cleaning existing data...');
    await prisma.messageRead.deleteMany();
    await prisma.message.deleteMany();
    await prisma.channelUser.deleteMany();
    await prisma.channel.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.channelRole.deleteMany();
    console.log('✅ Existing data cleaned');

    // シードデータの投入
    await seedChannelRoles(prisma);
    const users = await seedUsers(prisma);
    const channels = await seedChannels(prisma, users);
    await seedMessages(prisma, users, channels);

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });