import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect all routes under /admin, excluding the login page itself (handled in authConfig)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
