export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/my-profile",
    "/admin",
    "/admin/:path*",
    "/my-activities",
    "/((?!api|_next/static|_next/image|favicon.ico).*)*/create",
  ],
}
