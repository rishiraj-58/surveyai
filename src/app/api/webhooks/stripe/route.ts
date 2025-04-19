import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type { Stripe } from 'stripe'

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

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          amount,
          type: 'credit',
          status: 'completed',
          stripeSessionId: session.id,
        },
      })
      break;
    
    // Add other event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new NextResponse(null, { status: 200 })
} 