import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { isUrlMatching } from "./lib/utils";
import {
  allowedWhenExpiredRoutes,
  authRoutes,
  publicRoutes,
} from "./constants/routes";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const route = request.nextUrl;
  if (route.pathname.startsWith("/api")) return;
  const { data: user } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
    },
  });
  const isLoggedIn = user != null;

  const isPublicRoute = isUrlMatching(route.pathname, publicRoutes);
  const isAuthRoute = isUrlMatching(route.pathname, authRoutes);

  // Handle auth routes (login, signup, etc.)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", route));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", route));
  }

  // Default: allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    "/(api|trpc)(.*)",
  ],
};
