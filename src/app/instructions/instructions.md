📌 Goal

Your goal is to build a beautiful, modern, scalable AI-powered SaaS application for survey generation and analysis using Next.js and modern technologies.
This app will allow users to:
Enter a survey topic
Get AI-generated smart survey/interview questions
Simulate answering them through a chat-like interface
Receive AI-generated summaries, sentiment analysis, and actionable insights
🛠️ Technologies Used

Next.js 14 as the core framework
TypeScript for type safety
Tailwind CSS for clean, minimal styling
Clerk for authentication
Prisma (optional, for scalable DB management)
Supabase for real-time DB, auth, and storage
Stripe for payment integration
AWS S3 for file storage (if needed)
OpenAI GPT-4 API for AI question generation, response summarizing, and sentiment analysis
Webhooks for async operations
📦 Core Functionality

1️⃣ Database
Define Supabase tables (or Prisma schema if preferred) for:
users
surveys
responses
summaries
transactions (for credit/payment handling)
2️⃣ Authentication
Full Clerk integration
Webhooks for user.created, user.deleted, user.updated
User data stored in Supabase or Prisma
3️⃣ Payment System
Stripe Checkout integration
Transaction history table:
id
userId
amount
type
status
stripeSessionId
createdAt
Credit-based system:
1 credit = 1 survey generation
Bulk purchase discounts (e.g., 20 credits = $18)
4️⃣ File Management 
Integrate AWS S3 for file storage if required
Handle file validation and upload status
5️⃣ AI Survey Functionality
OpenAI API (GPT-4) integration:
Generate survey/interview questions based on a topic
Summarize answers
Perform sentiment analysis (Positive, Neutral, Negative)
Return recommended actions
6️⃣ Deployment
Create github repository and push the project
Deploy to Vercel
Add environment variables
📄 Pages Structure

🏠 Landing Page
Clean hero section (headline, subtext, CTA button)
Product features (AI-powered feedback collection, auto-insights, sentiment analysis)
Testimonials section
Pricing plans (Free, Pro, Enterprise)
Footer with Terms, Privacy, and Contact
🎛️ Try Product Page
Input survey topic or goal
AI-generated smart survey questions
Chat-like answering interface
AI-generated summary with sentiment insights
Clean insights summary and recommended action points
📚 Library Page
Display user’s past surveys and AI summaries
💳 Credits Purchase Page
Show current balance
Credit purchasing options and history
📑 Code Documentation

1️⃣ Clerk Authentication
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
2️⃣ Stripe Payment Integration
import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
📌 Important Implementation Notes

✅ Project Setup
Components in /components
Pages in /app using Next.js 14 App Router
Separate Server Components (for data fetching) and Client Components using 'use client'
✅ Server API Calls
Use /api server routes for AI and Stripe calls
Validate requests securely
✅ Environment Variables
Use .env for sensitive data
Configure on Vercel/Supabase/Clerk dashboard
✅ Error Handling
User-friendly client and server error messages
✅ Type Safety
TypeScript interfaces for all data structures
Input validation
✅ External API Client Initialization
Initialize only on the server
✅ Data Fetching
React hooks for UI data management
Manage loading and error states
✅ Component Structure
Reusable, optimized components
Props for data passing
Soft shadows, rounded corners, clean typography (Inter/Poppins)
✅ Code Standards
Consistent code style
Import optimizations
Correct package versions
Comment/document tricky parts
🚀 Deployment

Create GitHub repo and push project
Deploy to Vercel
Configure environment variables on the platform
Add Supabase and Clerk API keys