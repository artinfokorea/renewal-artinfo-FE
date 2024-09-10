export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/my-profile",
    "/((?!api|_next/static|_next/image|favicon.ico).*)*/create",
  ],
}
