import { authOptions } from '@/app/lib/auth';
import { connectToDB } from '@/app/lib/mongoose';
import Chat from '@/app/models/Chat';
import { sendToGemini } from '@/lib/gemini';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  //connect to DB
  await connectToDB();
  // get user if authenticated
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();
    const { prompt, chatId } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' },
        { status: 400 },
      );
    }

    const reply = await sendToGemini(prompt);
    const titlePrompt = `Give me a short 1 word title for this chat topic: "${prompt}". Do not include punctuation.`;
    const rawTitle = await sendToGemini(titlePrompt);
    const title = rawTitle.trim().replace(/\n/g, '');
    console.log('Title is:', title, 'prompt is:', prompt);
    // If user is authenticated
    if (session && session.user?.email) {
      if (chatId) {
        // Append to existing chat
        const existingChat = await Chat.findById(chatId);

        if (!existingChat) {
          return NextResponse.json(
            { error: 'Chat not found' },
            { status: 404 },
          );
        }

        existingChat.messages.push({ role: 'user', text: prompt });
        existingChat.messages.push({ role: 'ai', text: reply });
        await existingChat.save();

        return NextResponse.json({ reply, chatId, title: existingChat.title });
      } else {
        // Create new chat
        const newChat = await Chat.create({
          title,
          userId: session?.user?.email || null,
          messages: [
            { role: 'user', text: prompt },
            { role: 'ai', text: reply },
          ],
        });

        return NextResponse.json({ reply, chatId: newChat._id, title });
      }
    }

    // If unauthenticated, return only the reply (no DB)
    return NextResponse.json({ reply, title });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to provide a response' },
      { status: 500 },
    );
  }
}
