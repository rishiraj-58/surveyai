import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDownloadUrl } from '@/lib/s3'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    const { key } = await req.json()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify the user has access to this file
    if (!key.startsWith(`uploads/${user.id}/`)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get presigned URL for download
    const downloadUrl = await getDownloadUrl(key)

    return NextResponse.json({ downloadUrl })
  } catch (error) {
    console.error('[DOWNLOAD_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 