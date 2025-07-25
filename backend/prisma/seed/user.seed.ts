import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  console.log('🌱 Seeding users...');

  // TODO: 本番環境では適切にハッシュ化する
  const hashedPassword = 'password123';

  const users = [
    {
      name: '山田太郎',
      email: 'taro@example.com',
      password: hashedPassword,
      profileImgPath: null,
    },
    {
      name: '佐藤花子',
      email: 'hanako@example.com',
      password: hashedPassword,
      profileImgPath: null,
    },
    {
      name: '鈴木一郎',
      email: 'ichiro@example.com',
      password: hashedPassword,
      profileImgPath: null,
    },
    {
      name: '田中美咲',
      email: 'misaki@example.com',
      password: hashedPassword,
      profileImgPath: null,
    },
    {
      name: '高橋健太',
      email: 'kenta@example.com',
      password: hashedPassword,
      profileImgPath: null,
    },
  ];

  const createdUsers: any[] = [];
  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    createdUsers.push(created);
  }

  console.log('✅ Users seeded successfully');
  return createdUsers;
}