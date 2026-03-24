import { PrismaClient, User } from '@prisma/client';

export async function seedChannels(prisma: PrismaClient, users: User[]) {
  console.log('🌱 Seeding channels...');

  const channels = [
    {
      name: '全社連絡',
      creatorId: users[0].id,
      updaterId: users[0].id,
      isArchive: false,
    },
    {
      name: '開発チーム',
      creatorId: users[1].id,
      updaterId: users[1].id,
      isArchive: false,
    },
    {
      name: 'マーケティング',
      creatorId: users[2].id,
      updaterId: users[2].id,
      isArchive: false,
    },
    {
      name: '雑談',
      creatorId: users[0].id,
      updaterId: users[0].id,
      isArchive: false,
    },
    {
      name: 'プロジェクトA',
      creatorId: users[3].id,
      updaterId: users[3].id,
      isArchive: false,
    },
  ];

  const createdChannels: any[] = [];
  for (const channel of channels) {
    const created = await prisma.channel.create({
      data: channel,
    });
    createdChannels.push(created);
  }

  // チャンネルメンバーの設定
  // 全社連絡チャンネルには全員を追加
  for (const user of users) {
    await prisma.channelUser.create({
      data: {
        userId: user.id,
        channelId: createdChannels[0].id,
        roleId: user.id === users[0].id ? 'owner' : 'member',
      },
    });
  }

  // 開発チームチャンネル
  const devTeamMembers = [users[0], users[1], users[2], users[4]];
  for (let i = 0; i < devTeamMembers.length; i++) {
    await prisma.channelUser.create({
      data: {
        userId: devTeamMembers[i].id,
        channelId: createdChannels[1].id,
        roleId: i === 0 ? 'owner' : 'member',
      },
    });
  }

  // マーケティングチャンネル
  const marketingMembers = [users[2], users[3]];
  for (let i = 0; i < marketingMembers.length; i++) {
    await prisma.channelUser.create({
      data: {
        userId: marketingMembers[i].id,
        channelId: createdChannels[2].id,
        roleId: i === 0 ? 'owner' : 'member',
      },
    });
  }

  // 雑談チャンネルには全員を追加
  for (const user of users) {
    await prisma.channelUser.create({
      data: {
        userId: user.id,
        channelId: createdChannels[3].id,
        roleId: user.id === users[0].id ? 'owner' : 'member',
      },
    });
  }

  // プロジェクトAチャンネル
  const projectAMembers = [users[3], users[4], users[0]];
  for (let i = 0; i < projectAMembers.length; i++) {
    await prisma.channelUser.create({
      data: {
        userId: projectAMembers[i].id,
        channelId: createdChannels[4].id,
        roleId: i === 0 ? 'owner' : 'member',
      },
    });
  }

  console.log('✅ Channels and channel users seeded successfully');
  return createdChannels;
}