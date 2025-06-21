import { authOptions } from '@/app/lib/auth';
import { connectToDB } from '@/app/lib/mongoose';
import Chat from '@/app/models/Chat';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication error' });
  }
  // connect to DB
  await connectToDB();

  // create new chat
  await Chat.create({
    userId: session.user.email,
    title: '',
    messages: [],
  });
  return NextResponse.json({ message: 'New chat created', title: '' });
}
