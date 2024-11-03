export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/my-profile",
    "/my-activities",
    "/((?!api|_next/static|_next/image|favicon.ico).*)*/create",
  ],
}
