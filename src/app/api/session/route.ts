import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SessionResponse } from "@/features/auth/types/auth";

export async function GET(): Promise<NextResponse<SessionResponse>> {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return NextResponse.json({ loggedIn: false, success: true });
    return NextResponse.json({ loggedIn: true, success: true });
}
