import { PrismaClient } from '@prisma/client';

export async function seedChannelRoles(prisma: PrismaClient) {
  console.log('🌱 Seeding channel roles...');

  const channelRoles = [
    { id: 'owner', name: 'OWNER', sortNo: 1 },
    { id: 'admin', name: 'ADMIN', sortNo: 2 },
    { id: 'member', name: 'MEMBER', sortNo: 3 },
  ];

  for (const role of channelRoles) {
    await prisma.channelRole.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
  }

  console.log('✅ Channel roles seeded successfully');
}