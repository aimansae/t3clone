import { authOptions } from '@/app/lib/auth';
import { connectToDB } from '@/app/lib/mongoose';
import Chat from '@/app/models/Chat';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  await connectToDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' });
  }
  const { id } = context.params;
  try {
    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    if (chat.userId !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({
      title: chat.title,
      messages: chat.messages,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch chats' });
  }
}
