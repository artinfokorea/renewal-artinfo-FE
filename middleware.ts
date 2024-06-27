export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/my-profile", "/jobs/create", "/lessons/create"],
}
