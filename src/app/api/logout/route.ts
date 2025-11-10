import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginLogoutResponse } from "@/features/auth/types/auth";

export async function POST(): Promise<NextResponse<LoginLogoutResponse>> {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return NextResponse.json({ success: true });
}
