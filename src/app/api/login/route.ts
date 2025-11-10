import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginLogoutResponse } from "@/features/auth/types/auth";
import { env } from "@/utils/env";

export async function POST(req: Request): Promise<NextResponse<LoginLogoutResponse>> {
    const cookieStore = await cookies();

    try {
        const { username, password } = await req.json();

        const sessionMaxAge = env.NEXT_PUBLIC_SESSION_DURATION; // fallback default (1 hour)

        // Mock user check
        if (username && password) {
            cookieStore.set({
                name: "session",
                value: JSON.stringify({ username }),
                httpOnly: true,
                path: "/",
                maxAge: sessionMaxAge, // 1 hour
                sameSite: "lax",
                secure: true,
            });

            return NextResponse.json({ success: true });
        }
    } catch {
        return NextResponse.json(
            { success: false, message: "Error parsing params" },
            { status: 500 },
        );
    }

    return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
    );
}
