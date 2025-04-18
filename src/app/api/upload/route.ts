import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUploadUrl } from '@/lib/s3'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    const { fileName } = await req.json()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Generate a unique key for the file
    const key = `uploads/${user.id}/${Date.now()}-${fileName}`

    // Get presigned URL for upload
    const uploadUrl = await getUploadUrl(key)

    return NextResponse.json({ uploadUrl, key })
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 