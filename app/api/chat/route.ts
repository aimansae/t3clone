import { authOptions } from '@/app/lib/auth';
import { sendToGemini } from '@/lib/gemini';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import Chat from '@/app/models/Chat';
import { connectToDB } from '@/app/lib/mongoose';
export async function POST(req: NextRequest) {
  // verify auth session
  const session = await getServerSession(authOptions);
  // if (!session)
  //   return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  //get prompt
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: 'Missing Prompt' }, { status: 400 });
  }
  // connect to DB
  await connectToDB();
  const reply = await sendToGemini(prompt);

  // save to mondoDb

  const chat = await Chat.findOneAndUpdate(
    { userId: session?.user?.email },
    {
      $push: {
        messages: [
          { role: 'user', text: prompt },
          { role: 'ai', text: reply },
        ],
      },
    },
    { upsert: true, new: true },
  );
  console.log('Chat updated:', chat);
  return NextResponse.json({ reply, chat });
}

export async function GET() {
  // get the logged in user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectToDB();
  const chat = await Chat.findOne({ userId: session?.user?.email });
  if (!chat) {
    return NextResponse.json({ messages: chat?.messages || [] });
  }

  return NextResponse.json({ messages: chat.messages });
}
