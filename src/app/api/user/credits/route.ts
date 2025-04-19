import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Verify authentication
    const { userId: authenticatedUserId } = auth();
    
    if (!authenticatedUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Either fetch the authenticated user's credits or a specific user's credits
    // (latter only allowed if authenticated user is an admin, which we're not implementing here)
    const targetUserId = userId || authenticatedUserId;
    
    // Only allow users to fetch their own credits
    if (targetUserId !== authenticatedUserId) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Get user with credits
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { credits: true }
    });
    
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error('[USER_CREDITS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 