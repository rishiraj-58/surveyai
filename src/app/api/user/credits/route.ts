import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');
    
    // Verify authentication
    const user = await currentUser();
    
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const authenticatedUserId = user.id;
    
    // Either fetch the authenticated user's credits or a specific user's credits
    // (latter only allowed if authenticated user is an admin, which we're not implementing here)
    const targetUserId = requestedUserId || authenticatedUserId;
    
    // Only allow users to fetch their own credits
    if (targetUserId !== authenticatedUserId) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Get user with credits
    const dbUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { credits: true }
    });
    
    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    return NextResponse.json({ credits: dbUser.credits });
  } catch (error) {
    console.error('[USER_CREDITS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 