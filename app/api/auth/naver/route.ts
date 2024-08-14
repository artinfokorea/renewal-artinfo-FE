import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { code, state } = await request.json()

  const tokenRequest = await fetch("https://nid.naver.com/oauth2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NAVER_CLIENT_ID!,
      client_secret: process.env.NAVER_CLIENT_SECRET!,
      code,
      state,
    }),
  })

  const tokenData = await tokenRequest.json()
  console.log("tokenData", tokenData)
  if (tokenData.access_token) {
    return NextResponse.json({ success: true, token: tokenData.access_token })
  } else {
    return NextResponse.json(
      { success: false, error: "Failed to get access token" },
      { status: 400 },
    )
  }
}
