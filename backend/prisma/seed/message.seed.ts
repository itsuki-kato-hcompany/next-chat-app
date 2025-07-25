import { PrismaClient, User, Channel } from '@prisma/client';

export async function seedMessages(prisma: PrismaClient, users: User[], channels: Channel[]) {
  console.log('🌱 Seeding messages...');

  const messages = [
    // 全社連絡チャンネル
    {
      message: 'おはようございます！今日もよろしくお願いします。',
      userId: users[0].id,
      channelId: channels[0].id,
    },
    {
      message: '本日の定例会議は14:00からです。',
      userId: users[0].id,
      channelId: channels[0].id,
    },
    {
      message: '了解しました！',
      userId: users[1].id,
      channelId: channels[0].id,
    },
    {
      message: '会議の資料を共有しました。ご確認ください。',
      userId: users[2].id,
      channelId: channels[0].id,
    },

    // 開発チームチャンネル
    {
      message: '新機能の開発進捗はいかがですか？',
      userId: users[1].id,
      channelId: channels[1].id,
    },
    {
      message: '順調に進んでいます。今週中にはPR出せそうです。',
      userId: users[2].id,
      channelId: channels[1].id,
    },
    {
      message: 'コードレビューお願いします！',
      userId: users[4].id,
      channelId: channels[1].id,
    },
    {
      message: '確認します！',
      userId: users[1].id,
      channelId: channels[1].id,
    },

    // マーケティングチャンネル
    {
      message: '今月のキャンペーン企画について話し合いましょう。',
      userId: users[2].id,
      channelId: channels[2].id,
    },
    {
      message: '良いアイデアがあります。明日の会議で提案します。',
      userId: users[3].id,
      channelId: channels[2].id,
    },

    // 雑談チャンネル
    {
      message: '今日のランチどこにする？',
      userId: users[0].id,
      channelId: channels[3].id,
    },
    {
      message: 'イタリアンはどう？',
      userId: users[1].id,
      channelId: channels[3].id,
    },
    {
      message: '賛成！12時に集合で。',
      userId: users[2].id,
      channelId: channels[3].id,
    },
    {
      message: '私も参加します！',
      userId: users[3].id,
      channelId: channels[3].id,
    },
    {
      message: '楽しみです😊',
      userId: users[4].id,
      channelId: channels[3].id,
    },

    // プロジェクトAチャンネル
    {
      message: 'プロジェクトAのキックオフミーティングを開催します。',
      userId: users[3].id,
      channelId: channels[4].id,
    },
    {
      message: 'スケジュールを確認しました。参加します。',
      userId: users[4].id,
      channelId: channels[4].id,
    },
    {
      message: '要件定義書をアップロードしました。',
      userId: users[0].id,
      channelId: channels[4].id,
    },
    {
      message: 'ありがとうございます。確認します。',
      userId: users[3].id,
      channelId: channels[4].id,
    },
    {
      message: '質問があればいつでも聞いてください。',
      userId: users[0].id,
      channelId: channels[4].id,
    },
  ];

  const createdMessages: any[] = [];
  for (const message of messages) {
    const created = await prisma.message.create({
      data: message,
    });
    createdMessages.push(created);

    // ランダムに既読をつける
    const readByUsers = users.filter(u => u.id !== message.userId && Math.random() > 0.3);
    for (const user of readByUsers) {
      await prisma.messageRead.create({
        data: {
          userId: user.id,
          messageId: created.id,
        },
      });
    }
  }

  console.log('✅ Messages and message reads seeded successfully');
  return createdMessages;
}