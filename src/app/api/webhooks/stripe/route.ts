import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type { Stripe } from 'stripe'

// Map price amounts to credit amounts with proper typing
const CREDIT_PACKAGES: Record<string, number> = {
  '5': 5,    // $5 = 5 credits
  '18': 20,  // $18 = 20 credits
  '40': 50   // $40 = 50 credits
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    return new NextResponse('Webhook Error', { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      const userId = session.metadata?.userId
      const amount = session.amount_total ? session.amount_total / 100 : 0

      if (!userId) {
        return new NextResponse('User ID is required', { status: 400 })
      }

      // Determine number of credits to add based on the amount
      const amountKey = amount.toString();
      const creditsToAdd = CREDIT_PACKAGES[amountKey] || Math.floor(amount);
      
      try {
        // Start a transaction to ensure both operations succeed or fail together
        await prisma.$transaction(async (tx) => {
          // Create transaction record
          await tx.transaction.create({
            data: {
              userId,
              amount,
              type: 'credit',
              status: 'completed',
              stripeSessionId: session.id,
            },
          });
          
          // Update user's credits
          await tx.user.update({
            where: { id: userId },
            data: {
              credits: {
                increment: creditsToAdd
              }
            }
          });
        });
        
        console.log(`Added ${creditsToAdd} credits to user ${userId}`);
      } catch (error) {
        console.error('Error processing payment:', error);
        return new NextResponse('Error processing payment', { status: 500 });
      }
      break;
    
    // Add other event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new NextResponse(null, { status: 200 })
} 