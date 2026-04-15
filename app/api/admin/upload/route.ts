import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })

  try {
    const formData = await req.json() // We'll send base64 or a buffer
    const { file, folder } = formData

    if (!file) {
      return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: (folder || "iceburg-exam").trim(),
      resource_type: "auto",
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Yuklashda xatolik yuz berdi" }, { status: 500 })
  }
}
