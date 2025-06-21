import { authOptions } from '@/app/lib/auth';
import { connectToDB } from '@/app/lib/mongoose';
import Chat from '@/app/models/Chat';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const chats = await Chat.find({ userId: session.user.email });
    console.log('CHats', chats);
    return NextResponse.json({ chats });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Failed to fetch chats' });
  }
}
