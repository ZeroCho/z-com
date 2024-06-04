import { auth } from "./auth"
import {NextRequest, NextResponse} from "next/server";

export async function middleware(request: NextRequest) {
  console.log('middleware', request.nextUrl.pathname);
  const session = await auth();
  if (!session) {
    return NextResponse.redirect('https://z.nodebird.com/i/flow/login');
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/compose/tweet', '/home', '/explore', '/messages', '/search'],
}
